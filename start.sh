#!/bin/bash

# Notes Simplifier Startup Script
echo "🚀 Starting Notes Simplifier..."

# Check if virtual environment exists, create if not
if [ ! -d "backend/venv" ]; then
    echo "📦 Creating Python virtual environment..."
    cd backend
    python3 -m venv venv
    cd ..
fi

# Function to start backend
start_backend() {
    echo "🐍 Starting Flask backend..."
    cd backend
    source venv/bin/activate
    
    # Install dependencies if needed
    pip install -r requirements.txt
    
    # Install system dependencies for OCR
    echo "📄 Installing system dependencies for OCR..."
    if command -v apt-get &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y tesseract-ocr tesseract-ocr-eng
    elif command -v yum &> /dev/null; then
        sudo yum install -y tesseract tesseract-langpack-eng
    elif command -v brew &> /dev/null; then
        brew install tesseract
    else
        echo "⚠️ Please install tesseract-ocr manually for your system"
    fi
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        echo "📝 Creating .env file from template..."
        cp .env.example .env
        echo ""
        echo "⚠️ IMPORTANT: Please edit backend/.env and add your API keys:"
        echo "   - OPENAI_API_KEY=your_openai_api_key"
        echo "   - PERPLEXITY_API_KEY=your_perplexity_api_key"
        echo ""
    fi
    
    # Start Flask app
    python app.py &
    BACKEND_PID=$!
    cd ..
}

# Function to start frontend
start_frontend() {
    echo "⚛️ Starting React frontend..."
    cd frontend
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing npm dependencies..."
        npm install
    fi
    
    # Start React app
    npm start &
    FRONTEND_PID=$!
    cd ..
}

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down Notes Simplifier..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start both services
start_backend
start_frontend

echo ""
echo "✅ Notes Simplifier is starting up!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for processes
wait