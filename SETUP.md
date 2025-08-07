# Notes Simplifier - Setup Guide

## 🎯 Overview

Notes Simplifier is a comprehensive web application that transforms complex documents into simple, understandable content using AI. It features OCR text extraction, AI-powered simplification, educational games, and a beautiful classical UI.

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** (for backend)
- **Node.js 16+** (for frontend)
- **npm or yarn** (package manager)
- **Tesseract OCR** (for image text extraction)

### One-Command Setup

```bash
./start.sh
```

This script will:
- Set up Python virtual environment
- Install all dependencies
- Install system dependencies (Tesseract OCR)
- Start both backend and frontend servers
- Open the application at http://localhost:3000

## 🔧 Manual Setup

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Install Tesseract OCR:**
   
   **Ubuntu/Debian:**
   ```bash
   sudo apt-get update
   sudo apt-get install tesseract-ocr tesseract-ocr-eng
   ```
   
   **CentOS/RHEL:**
   ```bash
   sudo yum install tesseract tesseract-langpack-eng
   ```
   
   **macOS:**
   ```bash
   brew install tesseract
   ```
   
   **Windows:**
   Download and install from: https://github.com/UB-Mannheim/tesseract/wiki

5. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and add your API keys
   ```

6. **Start the Flask server:**
   ```bash
   python app.py
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm start
   ```

## 🔑 API Keys Configuration

Create a `.env` file in the `backend` directory with the following variables:

```env
OPENAI_API_KEY=your_openai_api_key_here
PERPLEXITY_API_KEY=your_perplexity_api_key_here
SECRET_KEY=your_secret_key_here
DATABASE_URL=sqlite:///notes_simplifier.db
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
```

### Getting API Keys

1. **OpenAI API Key:**
   - Visit https://platform.openai.com/api-keys
   - Create an account and generate an API key
   - Add billing information (required for API usage)

2. **Perplexity API Key:**
   - Visit https://www.perplexity.ai/
   - Sign up and navigate to API section
   - Generate an API key

3. **Secret Key:**
   - Generate a random secret key for JWT tokens
   - You can use: `python -c "import secrets; print(secrets.token_hex(32))"`

## 📱 Application Features

### 🔐 Authentication System
- User registration and login
- JWT-based authentication
- Secure password hashing
- Protected routes

### 📄 File Processing
- **Text Files:** .txt, .md files
- **Images:** .png, .jpg, .jpeg, .bmp, .tiff
- **OCR:** Automatic text extraction from images
- **AI Simplification:** Using ChatGPT and Perplexity APIs

### 🎮 Educational Features
- **Games:** AI-generated puzzles and quizzes
- **Chat Bot:** Interactive AI assistant
- **Learning Analytics:** Progress tracking

### 🎨 Classical Rich UI
- Beautiful classical design with modern functionality
- Responsive layout for all devices
- Smooth animations and transitions
- Professional typography (Playfair Display, Crimson Text)

## 🏗️ Project Structure

```
notes-simplifier/
├── backend/                 # Flask API server
│   ├── app.py              # Main application file
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example       # Environment variables template
│   └── uploads/           # File upload directory
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── theme.js      # Material-UI theme
│   │   └── App.js        # Main app component
│   ├── public/           # Static files
│   └── package.json      # Node.js dependencies
├── README.md              # Project overview
├── SETUP.md              # This setup guide
└── start.sh              # Quick start script
```

## 🔧 Development

### Backend Development
- Flask with SQLAlchemy ORM
- JWT authentication
- RESTful API design
- File upload handling
- AI API integrations

### Frontend Development
- React 18 with hooks
- Material-UI components
- Custom classical theme
- Framer Motion animations
- Axios for API calls

## 🚨 Troubleshooting

### Common Issues

1. **Tesseract not found:**
   - Ensure Tesseract is installed and in PATH
   - On Windows, add Tesseract to system PATH

2. **API key errors:**
   - Verify API keys are correctly set in .env file
   - Check API key validity and billing status

3. **Port conflicts:**
   - Backend runs on port 5000
   - Frontend runs on port 3000
   - Change ports in configuration if needed

4. **Database issues:**
   - Delete `notes_simplifier.db` to reset database
   - Check file permissions in upload directory

### Performance Tips

1. **Image Upload:**
   - Compress large images before upload
   - Supported formats: PNG, JPG, JPEG, BMP, TIFF
   - Maximum file size: 16MB

2. **API Limits:**
   - Monitor OpenAI API usage
   - Consider implementing rate limiting for production

## 🚀 Deployment

### Production Deployment

1. **Backend:**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

2. **Frontend:**
   ```bash
   npm run build
   # Serve build folder with nginx or similar
   ```

3. **Environment:**
   - Set production environment variables
   - Use PostgreSQL instead of SQLite
   - Configure reverse proxy (nginx)
   - Set up SSL certificates

## 📞 Support

For issues and questions:
- Check the troubleshooting section above
- Use the feedback form in the application
- Review the console logs for error details

## 🎉 Enjoy!

Your Notes Simplifier application is ready to transform complex content into simple, understandable text with the power of AI!