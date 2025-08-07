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
# OpenAI will be imported locally in functions
import json

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

# OpenAI API key will be used in individual functions

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

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

def simplify_text_with_openai(text):
    """Simplify text using OpenAI GPT"""
    try:
        from openai import OpenAI
        client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that simplifies complex text into easy-to-understand language. Make it clear, concise, and accessible while preserving the main ideas."},
                {"role": "user", "content": f"Please simplify this text: {text}"}
            ],
            max_tokens=1000,
            temperature=0.7
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
    """Generate educational games based on text content"""
    try:
        from openai import OpenAI
        client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Generate educational games based on the given text. Create quiz questions, word puzzles, and fill-in-the-blank exercises. Return as JSON with different game types."},
                {"role": "user", "content": f"Create educational games for this text: {text[:1000]}"}
            ],
            max_tokens=1500,
            temperature=0.8
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
    elif file_ext in ['jpg', 'jpeg', 'png', 'bmp', 'tiff']:
        original_text = extract_text_from_image(file_path)
        file_type = 'image'
    else:
        return jsonify({'message': 'Unsupported file type'}), 400
    
    # Simplify text using both APIs
    simplified_openai = simplify_text_with_openai(original_text)
    simplified_perplexity = simplify_text_with_perplexity(original_text)
    
    # Combine both simplifications
    simplified_text = f"OpenAI Simplification:\n{simplified_openai}\n\nPerplexity Simplification:\n{simplified_perplexity}"
    
    # Save to database
    document = Document(
        user_id=user_id,
        filename=filename,
        original_text=original_text,
        simplified_text=simplified_text,
        file_type=file_type
    )
    
    db.session.add(document)
    db.session.commit()
    
    # Generate games content
    games = generate_games_content(original_text)
    
    return jsonify({
        'id': document.id,
        'original_text': original_text,
        'simplified_text': simplified_text,
        'games': games,
        'file_type': file_type
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
    
    games = generate_games_content(document.original_text)
    
    return jsonify({
        'id': document.id,
        'filename': document.filename,
        'original_text': document.original_text,
        'simplified_text': document.simplified_text,
        'games': games,
        'file_type': document.file_type,
        'created_at': document.created_at.isoformat()
    })

@app.route('/api/chat', methods=['POST'])
@jwt_required()
def chat():
    data = request.get_json()
    message = data.get('message', '')
    context = data.get('context', '')
    
    try:
        system_prompt = "You are a helpful educational assistant. Answer questions about the provided context or general educational topics. Be clear, helpful, and encouraging."
        
        if context:
            system_prompt += f" Context: {context[:1000]}"
        
        from openai import OpenAI
        client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        return jsonify({
            'response': response.choices[0].message.content
        })
    except Exception as e:
        return jsonify({'message': 'Chat service unavailable'}), 500

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

@app.route('/api/user/profile', methods=['GET', 'PUT'])
@jwt_required()
def user_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    if request.method == 'GET':
        return jsonify({
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'created_at': user.created_at.isoformat()
        })
    
    elif request.method == 'PUT':
        data = request.get_json()
        
        if 'name' in data:
            user.name = data['name']
        if 'email' in data:
            # Check if email is already taken
            existing_user = User.query.filter(User.email == data['email'], User.id != user_id).first()
            if existing_user:
                return jsonify({'message': 'Email already in use'}), 400
            user.email = data['email']
        
        try:
            db.session.commit()
            return jsonify({'message': 'Profile updated successfully'})
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': 'Failed to update profile'}), 500

@app.route('/api/user/stats', methods=['GET'])
@jwt_required()
def user_stats():
    user_id = get_jwt_identity()
    
    # Get document count
    doc_count = Document.query.filter_by(user_id=user_id).count()
    
    # Get game stats
    game_scores = GameScore.query.filter_by(user_id=user_id).all()
    total_games = len(game_scores)
    total_score = sum(score.score for score in game_scores)
    avg_score = total_score / total_games if total_games > 0 else 0
    
    # Get feedback count
    feedback_count = Feedback.query.filter_by(user_id=user_id).count()
    
    return jsonify({
        'documents_processed': doc_count,
        'games_played': total_games,
        'total_score': total_score,
        'average_score': round(avg_score, 1),
        'feedback_submitted': feedback_count
    })

@app.route('/api/documents/<int:doc_id>', methods=['DELETE'])
@jwt_required()
def delete_document(doc_id):
    user_id = get_jwt_identity()
    document = Document.query.filter_by(id=doc_id, user_id=user_id).first()
    
    if not document:
        return jsonify({'message': 'Document not found'}), 404
    
    try:
        # Delete associated file if it exists
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{doc_id}_{document.filename}")
        if os.path.exists(file_path):
            os.remove(file_path)
        
        db.session.delete(document)
        db.session.commit()
        return jsonify({'message': 'Document deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to delete document'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0'
    })

@app.route('/api/feedback/<int:feedback_id>', methods=['GET'])
@jwt_required()
def get_feedback(feedback_id):
    user_id = get_jwt_identity()
    feedback = Feedback.query.filter_by(id=feedback_id, user_id=user_id).first()
    
    if not feedback:
        return jsonify({'message': 'Feedback not found'}), 404
    
    return jsonify({
        'id': feedback.id,
        'subject': feedback.subject,
        'message': feedback.message,
        'rating': feedback.rating,
        'created_at': feedback.created_at.isoformat()
    })

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'message': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'message': 'Internal server error'}), 500

@app.errorhandler(413)
def request_entity_too_large(error):
    return jsonify({'message': 'File too large'}), 413

# Initialize database
def create_tables():
    with app.app_context():
        db.create_all()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)