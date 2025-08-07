# Notes Simplifier - Deployment Guide

## 🚀 Production Deployment Options

### Option 1: Docker Compose (Recommended)

#### Prerequisites
- Docker and Docker Compose installed
- Domain name (optional, for SSL)
- API keys (OpenAI, Perplexity)

#### Quick Deploy
```bash
# Clone the repository
git clone <your-repo-url>
cd notes-simplifier

# Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys

# Deploy with Docker Compose
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f
```

#### Services
- **Frontend**: http://localhost:3000 (React + Nginx)
- **Backend**: http://localhost:5000 (Flask API)
- **Reverse Proxy**: http://localhost:80 (Nginx)

### Option 2: Manual Deployment

#### Backend Deployment
```bash
cd backend

# Install system dependencies (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install -y python3 python3-pip python3-venv tesseract-ocr

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install gunicorn

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Run with Gunicorn
gunicorn --bind 0.0.0.0:5000 --workers 4 app:app
```

#### Frontend Deployment
```bash
cd frontend

# Install Node.js dependencies
npm install

# Build for production
npm run build

# Serve with a static server (nginx, apache, etc.)
# Copy build/ contents to your web server
```

### Option 3: Cloud Deployment

#### Heroku
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create apps
heroku create notes-simplifier-api
heroku create notes-simplifier-web

# Deploy backend
cd backend
git init
heroku git:remote -a notes-simplifier-api
git add .
git commit -m "Deploy backend"
git push heroku main

# Deploy frontend
cd ../frontend
# Update API URL in build
npm run build
# Deploy to Netlify, Vercel, or Heroku
```

#### AWS/DigitalOcean
- Use EC2/Droplet with Docker Compose
- Set up load balancer
- Configure SSL with Let's Encrypt
- Use RDS for database (optional)

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Required
OPENAI_API_KEY=sk-...
PERPLEXITY_API_KEY=pplx-...
SECRET_KEY=your-secret-key

# Optional
DATABASE_URL=sqlite:///notes_simplifier.db
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
FLASK_ENV=production
```

#### Frontend
Update API endpoints in production build:
```javascript
// src/config.js
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com/api'
  : 'http://localhost:5000/api';
```

### SSL/HTTPS Setup

#### Let's Encrypt with Certbot
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Nginx SSL Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # Your app configuration...
}
```

## 📊 Monitoring & Maintenance

### Health Checks
```bash
# Check backend health
curl http://localhost:5000/api/health

# Check frontend health
curl http://localhost:3000/health

# Docker health status
docker-compose ps
```

### Logs
```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Application logs
tail -f backend/app.log
```

### Database Backup
```bash
# SQLite backup
cp backend/notes_simplifier.db backup_$(date +%Y%m%d_%H%M%S).db

# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
cp backend/notes_simplifier.db "$BACKUP_DIR/backup_$DATE.db"
find $BACKUP_DIR -name "backup_*.db" -mtime +7 -delete
```

### Performance Optimization

#### Backend
- Use Redis for caching
- Implement rate limiting
- Optimize database queries
- Use CDN for file uploads

#### Frontend
- Enable gzip compression
- Use CDN for static assets
- Implement service worker
- Optimize images

### Security Checklist

- [ ] HTTPS enabled
- [ ] API keys secured
- [ ] CORS configured properly
- [ ] Input validation implemented
- [ ] File upload restrictions
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Regular security updates

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            cd /path/to/notes-simplifier
            git pull origin main
            docker-compose down
            docker-compose up -d --build
```

## 🚨 Troubleshooting

### Common Issues

1. **OCR not working**
   - Install tesseract-ocr
   - Check tesseract in PATH
   - Verify image formats

2. **API keys not working**
   - Check .env file location
   - Verify API key format
   - Check API quotas/billing

3. **File upload fails**
   - Check file size limits
   - Verify upload directory permissions
   - Check disk space

4. **Database errors**
   - Check database file permissions
   - Verify SQLite installation
   - Run database migrations

### Performance Issues
- Monitor resource usage
- Check API response times
- Optimize database queries
- Scale horizontally if needed

## 📈 Scaling

### Horizontal Scaling
- Use load balancer (nginx, HAProxy)
- Deploy multiple backend instances
- Implement session storage (Redis)
- Use shared file storage

### Database Scaling
- Migrate to PostgreSQL
- Implement read replicas
- Use connection pooling
- Database sharding (if needed)

## 🔒 Security Best Practices

1. **API Security**
   - JWT token expiration
   - Rate limiting
   - Input sanitization
   - CORS configuration

2. **File Security**
   - File type validation
   - Size restrictions
   - Virus scanning
   - Secure storage

3. **Infrastructure Security**
   - Regular updates
   - Firewall configuration
   - SSH key authentication
   - Monitoring logs

## 📞 Support

For deployment issues:
1. Check logs for errors
2. Verify configuration
3. Test API endpoints
4. Review security settings
5. Monitor resource usage

Your Notes Simplifier is now ready for production! 🎉