# 📚 Notes Simplifier

> **Transform complex documents into simple, understandable content with the power of AI**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/react-18.0+-61dafb.svg)](https://reactjs.org/)
[![AI Powered](https://img.shields.io/badge/AI-Powered-ff6b6b.svg)](https://openai.com/)

A comprehensive web application that extracts text from files (text/images), simplifies complex content using AI, and provides interactive learning experiences with a beautiful classical UI design.

![Notes Simplifier Demo](https://via.placeholder.com/800x400/8B4513/FFFFFF?text=Notes+Simplifier+Demo)

## ✨ Features

### 🔍 **Smart Content Processing**
- 📄 **File Upload**: Support for text files (.txt, .md) and images (.png, .jpg, .jpeg, .bmp, .tiff)
- 🔍 **OCR Text Extraction**: Advanced text extraction from images using Tesseract OCR
- 🤖 **Dual AI Simplification**: Powered by both ChatGPT and Perplexity APIs for comprehensive text simplification

### 🎮 **Interactive Learning**
- 🎯 **Educational Games**: AI-generated quizzes, word puzzles, fill-in-the-blanks, memory games, crosswords, and sequence ordering
- 🏆 **Achievement System**: Unlock badges and track learning progress
- 📊 **Leaderboards**: Compete with other learners and track your ranking
- 📈 **Progress Analytics**: Detailed statistics and learning insights

### 💬 **AI Assistant**
- 🤖 **Context-Aware Chat**: Intelligent chatbot that understands your documents
- 💡 **Study Assistance**: Get explanations, summaries, and study recommendations
- 🔄 **Follow-up Questions**: Deep dive into topics with interactive conversations

### 🎨 **Classical Rich UI**
- 🏛️ **Classical Design**: Beautiful, professional interface with classical typography (Playfair Display, Crimson Text)
- 🎨 **Rich Color Palette**: Elegant browns, golds, and classical accent colors
- ✨ **Smooth Animations**: Engaging interactions powered by Framer Motion
- 📱 **Responsive Design**: Perfect experience on all devices

### 🔐 **User Management**
- 👤 **Secure Authentication**: JWT-based login and registration system
- 📊 **User Profiles**: Comprehensive profile management with statistics
- 📝 **Feedback System**: Rich feedback collection with rating system
- 🔒 **Privacy Focused**: Secure data handling and user privacy protection

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ (for backend)
- Node.js 16+ (for frontend)
- Tesseract OCR (for image text extraction)

### One-Command Setup
```bash
git clone https://github.com/your-username/notes-simplifier.git
cd notes-simplifier
chmod +x start.sh
./start.sh
```

This will:
- ✅ Set up Python virtual environment
- ✅ Install all dependencies (Python + Node.js)
- ✅ Install system dependencies (Tesseract OCR)
- ✅ Start both backend and frontend servers
- ✅ Open the application at http://localhost:3000

### Manual Setup

<details>
<summary>Click to expand manual setup instructions</summary>

#### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Install Tesseract OCR
# Ubuntu/Debian: sudo apt-get install tesseract-ocr
# macOS: brew install tesseract
# Windows: Download from GitHub

# Configure environment
cp .env.example .env
# Edit .env and add your API keys

python app.py
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```
</details>

## 🔑 API Keys Setup

Create a `.env` file in the `backend` directory:

```env
OPENAI_API_KEY=sk-your-openai-key-here
PERPLEXITY_API_KEY=pplx-your-perplexity-key-here
SECRET_KEY=your-secret-key-here
```

### Getting API Keys
- **OpenAI**: Visit [OpenAI Platform](https://platform.openai.com/api-keys)
- **Perplexity**: Visit [Perplexity AI](https://www.perplexity.ai/)

## 🏗️ Architecture

```
notes-simplifier/
├── 🔙 backend/              # Flask API Server
│   ├── app.py              # Main application
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example       # Environment template
│   └── uploads/           # File storage
├── ⚛️ frontend/            # React Application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── theme.js      # Material-UI theme
│   │   └── App.js        # Main app component
│   ├── public/           # Static assets
│   └── package.json      # Node.js dependencies
├── 🐳 Docker files        # Container configuration
├── 📚 Documentation      # Setup and deployment guides
└── 🚀 Deployment files   # Production configuration
```

## 🛠️ Tech Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: SQLite (SQLAlchemy ORM)
- **Authentication**: JWT tokens
- **AI Integration**: OpenAI GPT + Perplexity API
- **OCR**: Tesseract
- **File Processing**: Pillow, pytesseract

### Frontend
- **Framework**: React 18
- **UI Library**: Material-UI (MUI)
- **Styling**: Custom classical theme
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Routing**: React Router

### Deployment
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx
- **Process Manager**: Gunicorn
- **SSL**: Let's Encrypt support

## 📖 Usage Guide

### 1. **Upload Documents**
- Drag & drop files or click to browse
- Supports text files and images
- Automatic OCR for image content

### 2. **View Simplified Content**
- Original text extraction
- AI-powered simplification
- Reading metrics and analysis

### 3. **Play Educational Games**
- Quiz challenges
- Word puzzles
- Memory games
- Achievement tracking

### 4. **Chat with AI**
- Context-aware conversations
- Study assistance
- Topic explanations

### 5. **Track Progress**
- User statistics
- Learning analytics
- Achievement badges

## 🚀 Deployment

### Docker Compose (Recommended)
```bash
docker-compose up -d
```

### Manual Deployment
See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

### Cloud Platforms
- **Heroku**: Ready for Heroku deployment
- **AWS**: EC2 + RDS compatible
- **DigitalOcean**: Droplet deployment
- **Netlify/Vercel**: Frontend deployment

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md).

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT API
- **Perplexity** for AI search capabilities
- **Tesseract** for OCR functionality
- **Material-UI** for React components
- **Framer Motion** for animations

## 📞 Support

- 📧 **Email**: support@notes-simplifier.com
- 💬 **Discord**: [Join our community](https://discord.gg/notes-simplifier)
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/notes-simplifier/issues)
- 📖 **Documentation**: [Wiki](https://github.com/your-username/notes-simplifier/wiki)

## 🎯 Roadmap

- [ ] **Mobile App** (React Native)
- [ ] **Collaborative Features** (Team workspaces)
- [ ] **Advanced Analytics** (Learning insights)
- [ ] **Multi-language Support** (i18n)
- [ ] **Voice Integration** (Speech-to-text)
- [ ] **Plugin System** (Custom extensions)

---

<div align="center">

**Made with ❤️ for learners everywhere**

[⭐ Star this repo](https://github.com/your-username/notes-simplifier) • [🔄 Fork](https://github.com/your-username/notes-simplifier/fork) • [📝 Report Bug](https://github.com/your-username/notes-simplifier/issues) • [✨ Request Feature](https://github.com/your-username/notes-simplifier/issues)

</div> 
