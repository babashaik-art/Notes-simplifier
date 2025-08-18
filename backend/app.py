from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import os
import uuid
from datetime import datetime, timedelta
import requests
from PIL import Image
import pytesseract
import json
import numpy as np
import re
from sentence_transformers import SentenceTransformer
import faiss
import PyPDF2
import docx
import nltk
import spacy
import textstat
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from collections import Counter
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
from wordcloud import WordCloud
import io
import base64

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///notes_simplifier.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', 'uploads')
app.config['MAX_CONTENT_LENGTH'] = int(os.getenv('MAX_CONTENT_LENGTH', '16777216'))

# Initialize extensions
CORS(app)
db = SQLAlchemy(app)
jwt = JWTManager(app)

# Initialize AI models globally for better performance
sentence_model = None
nlp_model = None
vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')

def initialize_ai_models():
    """Initialize AI models on startup"""
    global sentence_model, nlp_model
    try:
        # Download NLTK data if not present
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            nltk.download('punkt')
        
        try:
            nltk.data.find('corpora/stopwords')
        except LookupError:
            nltk.download('stopwords')
        
        # Initialize sentence transformer for semantic similarity
        sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Try to load spaCy model
        try:
            nlp_model = spacy.load('en_core_web_sm')
        except OSError:
            print("spaCy model not found. Some features may be limited.")
            nlp_model = None
    except Exception as e:
        print(f"Error initializing AI models: {e}")

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize AI models
initialize_ai_models()

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    original_text = db.Column(db.Text, nullable=True)
    simplified_text = db.Column(db.Text, nullable=True)
    file_type = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class GameScore(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    game_type = db.Column(db.String(50), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    difficulty = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class DocumentAnalysis(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'), nullable=False)
    summary = db.Column(db.Text, nullable=True)
    key_concepts = db.Column(db.Text, nullable=True)  # JSON string
    reading_level = db.Column(db.String(50), nullable=True)
    word_count = db.Column(db.Integer, nullable=True)
    sentiment_score = db.Column(db.Float, nullable=True)
    topics = db.Column(db.Text, nullable=True)  # JSON string
    entities = db.Column(db.Text, nullable=True)  # JSON string
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ChatHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'), nullable=True)
    message = db.Column(db.Text, nullable=False)
    response = db.Column(db.Text, nullable=False)
    context_used = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class DocumentChunk(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'), nullable=False)
    chunk_text = db.Column(db.Text, nullable=False)
    chunk_index = db.Column(db.Integer, nullable=False)
    embedding = db.Column(db.Text, nullable=True)  # JSON string of vector
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Helper Functions
def extract_text_from_image(image_path):
    """Extract text from image using OCR"""
    try:
        image = Image.open(image_path)
        text = pytesseract.image_to_string(image)
        return text.strip()
    except Exception as e:
        print(f"OCR Error: {e}")
        return ""

def extract_text_from_pdf(file_path):
    """Extract text from PDF file"""
    try:
        text = ""
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        print(f"PDF Error: {e}")
        return ""

def extract_text_from_docx(file_path):
    """Extract text from DOCX file"""
    try:
        doc = docx.Document(file_path)
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text.strip()
    except Exception as e:
        print(f"DOCX Error: {e}")
        return ""

def chunk_text(text, chunk_size=1000, overlap=200):
    """Split text into overlapping chunks for better processing"""
    if not text:
        return []
    
    words = text.split()
    chunks = []
    
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        if chunk.strip():
            chunks.append(chunk.strip())
    
    return chunks

def analyze_document_content(text):
    """Comprehensive document analysis using NLP"""
    analysis = {}
    
    try:
        # Basic statistics
        analysis['word_count'] = len(text.split())
        analysis['character_count'] = len(text)
        analysis['paragraph_count'] = len([p for p in text.split('\n\n') if p.strip()])
        
        # Reading level analysis
        analysis['reading_level'] = textstat.flesch_kincaid_grade(text)
        analysis['reading_ease'] = textstat.flesch_reading_ease(text)
        
        # Extract key concepts using TF-IDF
        if text.strip():
            try:
                tfidf_matrix = vectorizer.fit_transform([text])
                feature_names = vectorizer.get_feature_names_out()
                tfidf_scores = tfidf_matrix.toarray()[0]
                
                # Get top 10 terms
                top_indices = tfidf_scores.argsort()[-10:][::-1]
                key_concepts = [feature_names[i] for i in top_indices if tfidf_scores[i] > 0]
                analysis['key_concepts'] = key_concepts
            except:
                analysis['key_concepts'] = []
        
        # Named Entity Recognition if spaCy is available
        if nlp_model:
            doc = nlp_model(text[:1000000])  # Limit text size for performance
            entities = {}
            for ent in doc.ents:
                if ent.label_ not in entities:
                    entities[ent.label_] = []
                if ent.text not in entities[ent.label_]:
                    entities[ent.label_].append(ent.text)
            analysis['entities'] = entities
        
        # Simple sentiment analysis (basic implementation)
        positive_words = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'positive', 'success', 'achievement']
        negative_words = ['bad', 'terrible', 'awful', 'horrible', 'negative', 'failure', 'problem', 'issue', 'difficult']
        
        text_lower = text.lower()
        positive_count = sum(text_lower.count(word) for word in positive_words)
        negative_count = sum(text_lower.count(word) for word in negative_words)
        
        total_sentiment_words = positive_count + negative_count
        if total_sentiment_words > 0:
            analysis['sentiment_score'] = (positive_count - negative_count) / total_sentiment_words
        else:
            analysis['sentiment_score'] = 0.0
            
    except Exception as e:
        print(f"Analysis error: {e}")
        analysis = {
            'word_count': len(text.split()) if text else 0,
            'character_count': len(text) if text else 0,
            'reading_level': 0,
            'key_concepts': [],
            'entities': {},
            'sentiment_score': 0.0
        }
    
    return analysis

def generate_document_summary(text, max_length=500):
    """Generate a comprehensive summary of the document"""
    try:
        from openai import OpenAI
        client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
        # Create a more sophisticated prompt for summarization
        prompt = f"""
        Please provide a comprehensive summary of the following document. The summary should:
        1. Capture the main ideas and key points
        2. Be well-structured and coherent
        3. Be approximately {max_length} words or less
        4. Include important details and context
        
        Document:
        {text[:4000]}  # Limit input to avoid token limits
        """
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Use more advanced model for better summaries
            messages=[
                {"role": "system", "content": "You are an expert at creating comprehensive, well-structured summaries that capture the essence of documents while maintaining clarity and coherence."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=800,
            temperature=0.3
        )
        
        return response.choices[0].message.content
    except Exception as e:
        print(f"Summary generation error: {e}")
        # Fallback: simple extractive summary
        sentences = nltk.sent_tokenize(text) if text else []
        return ". ".join(sentences[:3]) + "." if sentences else "Unable to generate summary."

def create_embeddings_for_chunks(chunks):
    """Create embeddings for text chunks using sentence transformer"""
    if not sentence_model or not chunks:
        return []
    
    try:
        embeddings = sentence_model.encode(chunks)
        return embeddings.tolist()
    except Exception as e:
        print(f"Embedding error: {e}")
        return []

def find_similar_chunks(query, document_id, top_k=3):
    """Find most similar chunks to a query using semantic search"""
    try:
        # Get all chunks for the document
        chunks = DocumentChunk.query.filter_by(document_id=document_id).all()
        
        if not chunks or not sentence_model:
            return []
        
        # Get embeddings for chunks
        chunk_embeddings = []
        chunk_texts = []
        
        for chunk in chunks:
            if chunk.embedding:
                embedding = json.loads(chunk.embedding)
                chunk_embeddings.append(embedding)
                chunk_texts.append(chunk.chunk_text)
        
        if not chunk_embeddings:
            return []
        
        # Get query embedding
        query_embedding = sentence_model.encode([query])
        
        # Calculate similarities
        similarities = cosine_similarity(query_embedding, chunk_embeddings)[0]
        
        # Get top k similar chunks
        top_indices = similarities.argsort()[-top_k:][::-1]
        
        similar_chunks = []
        for idx in top_indices:
            if similarities[idx] > 0.3:  # Threshold for relevance
                similar_chunks.append({
                    'text': chunk_texts[idx],
                    'similarity': float(similarities[idx])
                })
        
        return similar_chunks
        
    except Exception as e:
        print(f"Similarity search error: {e}")
        return []

def generate_word_cloud(text):
    """Generate word cloud image for text"""
    try:
        if not text or len(text.strip()) < 10:
            return None
            
        wordcloud = WordCloud(
            width=800, 
            height=400, 
            background_color='white',
            max_words=100,
            colormap='viridis'
        ).generate(text)
        
        # Save to bytes
        img_buffer = io.BytesIO()
        wordcloud.to_image().save(img_buffer, format='PNG')
        img_buffer.seek(0)
        
        # Convert to base64
        img_base64 = base64.b64encode(img_buffer.getvalue()).decode()
        return f"data:image/png;base64,{img_base64}"
        
    except Exception as e:
        print(f"Word cloud error: {e}")
        return None

def simplify_text_with_openai(text):
    """Simplify text using OpenAI GPT with enhanced prompting"""
    try:
        from openai import OpenAI
        client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
        # Enhanced system prompt for better simplification
        system_prompt = """You are an expert educational content simplifier. Your task is to transform complex text into clear, accessible language while:
        1. Preserving all important information and key concepts
        2. Using simpler vocabulary and shorter sentences
        3. Adding helpful explanations for technical terms
        4. Maintaining the logical flow and structure
        5. Making it engaging and easy to understand for a general audience
        
        Always provide accurate, well-structured simplified text that maintains the original meaning."""
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Use more advanced model
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Please simplify this text while maintaining all key information:\n\n{text[:3000]}"}
            ],
            max_tokens=1500,
            temperature=0.5
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"OpenAI Error: {e}")
        return text

def simplify_text_with_perplexity(text):
    """Simplify text using Perplexity API"""
    try:
        headers = {
            'Authorization': f'Bearer {os.getenv("PERPLEXITY_API_KEY")}',
            'Content-Type': 'application/json'
        }
        
        data = {
            "model": "llama-3.1-sonar-small-128k-online",
            "messages": [
                {"role": "system", "content": "You are a helpful assistant that simplifies complex text into easy-to-understand language."},
                {"role": "user", "content": f"Please simplify this text: {text}"}
            ],
            "max_tokens": 1000,
            "temperature": 0.7
        }
        
        response = requests.post('https://api.perplexity.ai/chat/completions', 
                               headers=headers, json=data)
        
        if response.status_code == 200:
            result = response.json()
            return result['choices'][0]['message']['content']
        else:
            print(f"Perplexity API Error: {response.status_code}")
            return simplify_text_with_openai(text)
    except Exception as e:
        print(f"Perplexity Error: {e}")
        return simplify_text_with_openai(text)

def generate_games_content(text):
    """Generate comprehensive educational games based on text content"""
    try:
        from openai import OpenAI
        client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
        system_prompt = """You are an expert educational game designer. Create diverse, engaging educational games based on the provided text. Generate the following types of games:

1. Multiple Choice Quiz (5-10 questions)
2. Fill-in-the-Blank exercises (5 questions)
3. True/False questions (5 questions)
4. Word Matching exercises
5. Short Answer questions (3-5 questions)

Format your response as valid JSON with the following structure:
{
  "quiz": [{"question": "...", "options": ["A", "B", "C", "D"], "correct": 0, "explanation": "..."}],
  "fill_blanks": [{"sentence": "The capital of France is ___", "answer": "Paris", "hint": "City of Light"}],
  "true_false": [{"statement": "...", "answer": true, "explanation": "..."}],
  "word_match": {"terms": ["term1", "term2"], "definitions": ["def1", "def2"]},
  "short_answer": [{"question": "...", "sample_answer": "...", "keywords": ["key1", "key2"]}]
}

Make sure all questions are directly based on the provided text and are educational."""
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Create comprehensive educational games for this text:\n\n{text[:2000]}"}
            ],
            max_tokens=2000,
            temperature=0.7
        )
        
        games_text = response.choices[0].message.content
        # Try to parse as JSON, fallback to structured text
        try:
            return json.loads(games_text)
        except:
            return {"quiz": games_text}
    except Exception as e:
        print(f"Games Generation Error: {e}")
        return {"error": "Could not generate games"}

# Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already exists'}), 400
    
    user = User(
        email=data['email'],
        password_hash=generate_password_hash(data['password']),
        name=data['name']
    )
    
    db.session.add(user)
    db.session.commit()
    
    access_token = create_access_token(identity=user.id)
    return jsonify({
        'access_token': access_token,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email
        }
    })

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if user and check_password_hash(user.password_hash, data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email
            }
        })
    
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/upload', methods=['POST'])
@jwt_required()
def upload_file():
    if 'file' not in request.files:
        return jsonify({'message': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No file selected'}), 400
    
    user_id = get_jwt_identity()
    filename = secure_filename(file.filename)
    unique_filename = f"{uuid.uuid4()}_{filename}"
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
    
    file.save(file_path)
    
    # Determine file type and extract text
    file_ext = filename.lower().split('.')[-1]
    original_text = ""
    
    if file_ext in ['txt', 'md']:
        with open(file_path, 'r', encoding='utf-8') as f:
            original_text = f.read()
        file_type = 'text'
    elif file_ext in ['pdf']:
        original_text = extract_text_from_pdf(file_path)
        file_type = 'pdf'
    elif file_ext in ['docx']:
        original_text = extract_text_from_docx(file_path)
        file_type = 'docx'
    elif file_ext in ['jpg', 'jpeg', 'png', 'bmp', 'tiff']:
        original_text = extract_text_from_image(file_path)
        file_type = 'image'
    else:
        return jsonify({'message': 'Unsupported file type. Supported: txt, md, pdf, docx, jpg, jpeg, png, bmp, tiff'}), 400
    
    if not original_text.strip():
        return jsonify({'message': 'No text could be extracted from the file'}), 400
    
    # Generate comprehensive document analysis
    analysis = analyze_document_content(original_text)
    summary = generate_document_summary(original_text)
    
    # Simplify text using enhanced AI
    simplified_text = simplify_text_with_openai(original_text)
    
    # Save document to database
    document = Document(
        user_id=user_id,
        filename=filename,
        original_text=original_text,
        simplified_text=simplified_text,
        file_type=file_type
    )
    
    db.session.add(document)
    db.session.commit()
    
    # Save document analysis
    doc_analysis = DocumentAnalysis(
        document_id=document.id,
        summary=summary,
        key_concepts=json.dumps(analysis.get('key_concepts', [])),
        reading_level=f"Grade {analysis.get('reading_level', 'N/A')}",
        word_count=analysis.get('word_count', 0),
        sentiment_score=analysis.get('sentiment_score', 0.0),
        topics=json.dumps([]),  # Can be enhanced with topic modeling
        entities=json.dumps(analysis.get('entities', {}))
    )
    
    db.session.add(doc_analysis)
    
    # Create and store document chunks with embeddings
    chunks = chunk_text(original_text)
    if chunks:
        embeddings = create_embeddings_for_chunks(chunks)
        
        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            doc_chunk = DocumentChunk(
                document_id=document.id,
                chunk_text=chunk,
                chunk_index=i,
                embedding=json.dumps(embedding) if embedding else None
            )
            db.session.add(doc_chunk)
    
    db.session.commit()
    
    # Generate games content
    games = generate_games_content(original_text)
    
    # Generate word cloud
    word_cloud = generate_word_cloud(original_text)
    
    return jsonify({
        'id': document.id,
        'original_text': original_text,
        'simplified_text': simplified_text,
        'summary': summary,
        'analysis': analysis,
        'games': games,
        'file_type': file_type,
        'word_cloud': word_cloud
    })

@app.route('/api/documents', methods=['GET'])
@jwt_required()
def get_documents():
    user_id = get_jwt_identity()
    documents = Document.query.filter_by(user_id=user_id).order_by(Document.created_at.desc()).all()
    
    return jsonify([{
        'id': doc.id,
        'filename': doc.filename,
        'file_type': doc.file_type,
        'created_at': doc.created_at.isoformat()
    } for doc in documents])

@app.route('/api/document/<int:doc_id>', methods=['GET'])
@jwt_required()
def get_document(doc_id):
    user_id = get_jwt_identity()
    document = Document.query.filter_by(id=doc_id, user_id=user_id).first()
    
    if not document:
        return jsonify({'message': 'Document not found'}), 404
    
    # Get document analysis
    analysis = DocumentAnalysis.query.filter_by(document_id=doc_id).first()
    
    # Generate games content
    games = generate_games_content(document.original_text)
    
    # Generate word cloud
    word_cloud = generate_word_cloud(document.original_text)
    
    result = {
        'id': document.id,
        'filename': document.filename,
        'original_text': document.original_text,
        'simplified_text': document.simplified_text,
        'games': games,
        'file_type': document.file_type,
        'created_at': document.created_at.isoformat(),
        'word_cloud': word_cloud
    }
    
    # Add analysis data if available
    if analysis:
        result.update({
            'summary': analysis.summary,
            'key_concepts': json.loads(analysis.key_concepts) if analysis.key_concepts else [],
            'reading_level': analysis.reading_level,
            'word_count': analysis.word_count,
            'sentiment_score': analysis.sentiment_score,
            'entities': json.loads(analysis.entities) if analysis.entities else {}
        })
    
    return jsonify(result)

@app.route('/api/chat', methods=['POST'])
@jwt_required()
def chat():
    data = request.get_json()
    message = data.get('message', '')
    document_id = data.get('document_id')
    user_id = get_jwt_identity()
    
    try:
        context = ""
        context_used = False
        
        # If document_id is provided, find relevant chunks using semantic search
        if document_id:
            similar_chunks = find_similar_chunks(message, document_id)
            if similar_chunks:
                context = "\n\n".join([chunk['text'] for chunk in similar_chunks])
                context_used = True
        
        # Enhanced system prompt for better responses
        system_prompt = """You are an expert educational assistant with deep knowledge across all academic subjects. Your responses should be:
        1. Accurate and well-researched
        2. Clear and easy to understand
        3. Educational and informative
        4. Encouraging and supportive
        5. Based on the provided context when available
        
        If context is provided, use it to give specific, relevant answers. If no context is available, provide general educational guidance."""
        
        if context:
            system_prompt += f"\n\nRelevant Context from Document:\n{context[:2000]}"
        
        from openai import OpenAI
        client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ],
            max_tokens=800,
            temperature=0.6
        )
        
        ai_response = response.choices[0].message.content
        
        # Save chat history
        chat_history = ChatHistory(
            user_id=user_id,
            document_id=document_id,
            message=message,
            response=ai_response,
            context_used=context_used
        )
        db.session.add(chat_history)
        db.session.commit()
        
        return jsonify({
            'response': ai_response,
            'context_used': context_used
        })
    except Exception as e:
        print(f"Chat error: {e}")
        return jsonify({'message': 'Chat service unavailable'}), 500

@app.route('/api/document/<int:doc_id>/search', methods=['POST'])
@jwt_required()
def search_document(doc_id):
    """Semantic search within a document"""
    user_id = get_jwt_identity()
    document = Document.query.filter_by(id=doc_id, user_id=user_id).first()
    
    if not document:
        return jsonify({'message': 'Document not found'}), 404
    
    data = request.get_json()
    query = data.get('query', '')
    
    if not query:
        return jsonify({'message': 'Query is required'}), 400
    
    # Find similar chunks
    similar_chunks = find_similar_chunks(query, doc_id, top_k=5)
    
    return jsonify({
        'query': query,
        'results': similar_chunks
    })

@app.route('/api/document/<int:doc_id>/generate-questions', methods=['POST'])
@jwt_required()
def generate_questions(doc_id):
    """Generate questions about the document"""
    user_id = get_jwt_identity()
    document = Document.query.filter_by(id=doc_id, user_id=user_id).first()
    
    if not document:
        return jsonify({'message': 'Document not found'}), 404
    
    try:
        from openai import OpenAI
        client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
        prompt = f"""Based on the following text, generate 10 thoughtful questions that would help someone better understand the content. Include a mix of:
        - Factual questions
        - Analytical questions
        - Application questions
        - Critical thinking questions
        
        Text: {document.original_text[:2000]}
        
        Format as JSON: {{"questions": ["question1", "question2", ...]}}"""
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert educator who creates engaging questions to enhance learning and comprehension."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1000,
            temperature=0.7
        )
        
        try:
            result = json.loads(response.choices[0].message.content)
            return jsonify(result)
        except:
            return jsonify({"questions": [response.choices[0].message.content]})
            
    except Exception as e:
        return jsonify({'message': 'Failed to generate questions'}), 500

@app.route('/api/document/<int:doc_id>/explain', methods=['POST'])
@jwt_required()
def explain_concept(doc_id):
    """Explain a specific concept from the document"""
    user_id = get_jwt_identity()
    document = Document.query.filter_by(id=doc_id, user_id=user_id).first()
    
    if not document:
        return jsonify({'message': 'Document not found'}), 404
    
    data = request.get_json()
    concept = data.get('concept', '')
    
    if not concept:
        return jsonify({'message': 'Concept is required'}), 400
    
    # Find relevant context
    similar_chunks = find_similar_chunks(concept, doc_id, top_k=3)
    context = "\n\n".join([chunk['text'] for chunk in similar_chunks]) if similar_chunks else document.original_text[:1000]
    
    try:
        from openai import OpenAI
        client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
        prompt = f"""Please provide a clear, detailed explanation of the concept "{concept}" based on the provided context. Your explanation should:
        1. Define the concept clearly
        2. Explain its significance or importance
        3. Provide examples if applicable
        4. Connect it to the broader context
        5. Use simple, accessible language
        
        Context: {context}"""
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert educator who excels at explaining complex concepts in simple, understandable terms."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=800,
            temperature=0.5
        )
        
        return jsonify({
            'concept': concept,
            'explanation': response.choices[0].message.content,
            'context_used': len(similar_chunks) > 0
        })
        
    except Exception as e:
        return jsonify({'message': 'Failed to generate explanation'}), 500

@app.route('/api/chat/history', methods=['GET'])
@jwt_required()
def get_chat_history():
    """Get chat history for the user"""
    user_id = get_jwt_identity()
    limit = request.args.get('limit', 50, type=int)
    
    chats = ChatHistory.query.filter_by(user_id=user_id)\
        .order_by(ChatHistory.created_at.desc())\
        .limit(limit).all()
    
    return jsonify([{
        'id': chat.id,
        'message': chat.message,
        'response': chat.response,
        'document_id': chat.document_id,
        'context_used': chat.context_used,
        'created_at': chat.created_at.isoformat()
    } for chat in chats])

@app.route('/api/analytics/user', methods=['GET'])
@jwt_required()
def get_user_analytics():
    """Get user analytics and statistics"""
    user_id = get_jwt_identity()
    
    # Document statistics
    doc_count = Document.query.filter_by(user_id=user_id).count()
    
    # Chat statistics
    chat_count = ChatHistory.query.filter_by(user_id=user_id).count()
    
    # Game statistics
    game_scores = GameScore.query.filter_by(user_id=user_id).all()
    avg_score = sum(score.score for score in game_scores) / len(game_scores) if game_scores else 0
    
    # Reading level analysis
    analyses = db.session.query(DocumentAnalysis)\
        .join(Document)\
        .filter(Document.user_id == user_id).all()
    
    reading_levels = [float(a.reading_level.replace('Grade ', '')) for a in analyses 
                     if a.reading_level and 'Grade' in a.reading_level]
    avg_reading_level = sum(reading_levels) / len(reading_levels) if reading_levels else 0
    
    return jsonify({
        'documents_uploaded': doc_count,
        'chat_interactions': chat_count,
        'average_game_score': round(avg_score, 2),
        'average_reading_level': round(avg_reading_level, 1),
        'total_game_sessions': len(game_scores)
    })

@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    data = request.get_json()
    
    # Get user_id if authenticated
    user_id = None
    try:
        from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
        verify_jwt_in_request(optional=True)
        user_id = get_jwt_identity()
    except:
        pass
    
    feedback = Feedback(
        user_id=user_id,
        name=data['name'],
        email=data['email'],
        subject=data['subject'],
        message=data['message'],
        rating=data.get('rating')
    )
    
    db.session.add(feedback)
    db.session.commit()
    
    return jsonify({'message': 'Feedback submitted successfully'})

@app.route('/api/game-score', methods=['POST'])
@jwt_required()
def save_game_score():
    data = request.get_json()
    user_id = get_jwt_identity()
    
    score = GameScore(
        user_id=user_id,
        game_type=data['game_type'],
        score=data['score'],
        difficulty=data['difficulty']
    )
    
    db.session.add(score)
    db.session.commit()
    
    return jsonify({'message': 'Score saved successfully'})

@app.route('/api/leaderboard/<game_type>', methods=['GET'])
def get_leaderboard(game_type):
    scores = db.session.query(
        GameScore.score,
        User.name,
        GameScore.difficulty,
        GameScore.created_at
    ).join(User).filter(
        GameScore.game_type == game_type
    ).order_by(GameScore.score.desc()).limit(10).all()
    
    return jsonify([{
        'score': score[0],
        'name': score[1],
        'difficulty': score[2],
        'date': score[3].isoformat()
    } for score in scores])

# Initialize database
def create_tables():
    with app.app_context():
        db.create_all()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)