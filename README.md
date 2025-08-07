# Notes Simplifier

A comprehensive web application that extracts text from files (text/images), simplifies complex content using AI, and provides interactive learning experiences.

## Features

- 📄 **File Upload**: Support for text files and images
- 🔍 **OCR Text Extraction**: Extract text from images using advanced OCR
- 🤖 **AI-Powered Simplification**: Simplify complex text using Perplexity and ChatGPT APIs
- 🎮 **Educational Games**: Interactive games and puzzles based on content
- 💬 **AI Chatbot**: Discuss topics and get answers to questions
- 🔐 **User Authentication**: Secure login and user management
- 📝 **Feedback System**: Rich feedback form for user suggestions
- 🎨 **Classical Rich UI**: Beautiful, classical design with modern functionality

## Tech Stack

### Backend
- Flask (Python web framework)
- SQLite (Database)
- OpenAI API (ChatGPT integration)
- Perplexity API
- Tesseract OCR (Text extraction from images)
- JWT (Authentication)

### Frontend
- React 18
- Material-UI with classical theming
- Axios (API calls)
- React Router (Navigation)
- Styled Components

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Configuration

Create a `.env` file in the backend directory with:
```
OPENAI_API_KEY=your_openai_api_key
PERPLEXITY_API_KEY=your_perplexity_api_key
SECRET_KEY=your_secret_key
```

## Usage

1. Register/Login to your account
2. Upload text files or images
3. View extracted and simplified text
4. Play educational games based on the content
5. Chat with the AI bot about topics
6. Provide feedback through the feedback form

## License

MIT License 
