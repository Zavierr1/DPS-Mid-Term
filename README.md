# HackQuest - Cybersecurity Challenge Platform

A comprehensive cybersecurity learning platform featuring interactive challenges in Network Security, Cryptography, XSS, and SQL Injection.

## 🚀 Features

### Challenge Categories
- **Network Security**: Subnet masks, protocols, attack types, DNS
- **Cryptography**: Caesar cipher, Base64, MD5, Vigenère, RSA, AES
- **XSS (Cross-Site Scripting)**: Script injection, DOM manipulation, CSP bypass
- **SQL Injection**: Authentication bypass, UNION attacks, blind injection

### Core Functionality
- 🔐 **Firebase Authentication**: Secure user registration and login
- 📊 **Progress Tracking**: Score tracking, challenge completion, user profiles
- 🎯 **Smart Answer Validation**: Fuzzy matching, synonyms, alternative spellings
- 🛡️ **Rate Limiting**: Protection against brute force attacks
- 🐳 **Docker Support**: Containerized deployment
- 📱 **Responsive Design**: Modern UI with Tailwind CSS

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │────│   Backend       │
│   React/TS      │    │   Node.js       │
│   Tailwind CSS  │    │   Express       │
│   Firebase Auth │    │   Firebase SDK  │
└─────────────────┘    └─────────────────┘
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- Docker & Docker Compose (optional)
- Firebase project with Auth and Firestore enabled

### 1. Clone Repository
```bash
git clone https://github.com/your-username/DPS-Mid-Term.git
cd DPS-Mid-Term
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### 3. Frontend Setup  
```bash
cd frontend
npm install
cp .env.example .env
# Configure your Firebase settings
npm run dev
```

### 4. Docker Setup (Alternative)
```bash
# Run entire application
docker-compose up --build

# Backend only
cd backend && docker build -t hackquest-backend .
docker run -p 5000:5000 hackquest-backend

# Frontend only  
cd frontend && docker build -t hackquest-frontend .
docker run -p 5173:5173 hackquest-frontend
```

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
PORT=5000
NODE_ENV=development
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
FIREBASE_PROJECT_ID=your-project-id
JWT_SECRET=your-secret-key
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=30
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend Environment Variables (.env)
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
# ... other Firebase config
```

## 📡 API Endpoints

### Challenge Data
- `GET /api/challenges/network` - Network security answers
- `GET /api/challenges/crypto` - Cryptography answers  
- `GET /api/challenges/xss` - XSS attack patterns
- `GET /api/challenges/sql` - SQL injection patterns

### Answer Validation
- `POST /api/challenges/check` - Validate network/crypto answers
- `POST /api/challenges/xss/check` - Validate XSS payloads
- `POST /api/challenges/sql/check` - Validate SQL injection

### User Management
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify` - Verify Firebase ID token
- `GET /api/user/:uid` - Get user profile
- `PUT /api/user/:uid` - Update user profile

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage report
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Production Build
```bash
# Frontend
cd frontend && npm run build

# Backend  
cd backend && npm start
```

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up --build
```

## 🔒 Security Features

- **Rate Limiting**: 30 requests/minute per IP on challenge endpoints
- **CORS Protection**: Configurable allowed origins
- **Security Headers**: XSS protection, content type sniffing prevention
- **Input Validation**: Joi schema validation for API inputs
- **Firebase Security Rules**: Proper Firestore access controls

## 📚 Challenge Answer System

The platform uses a sophisticated answer validation system:

### Network/Crypto Challenges
- **Exact Matching**: Primary answers get 100% score
- **Synonym Matching**: Alternative terms get 90% score  
- **Fuzzy Matching**: Similar answers get variable scores
- **Abbreviation Support**: Common abbreviations accepted

### XSS/SQL Challenges  
- **Pattern Matching**: Multiple attack variations supported
- **Required Elements**: Must contain specific exploit components
- **Case Insensitive**: Flexible input acceptance

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase for authentication and database services
- React and TypeScript communities
- Cybersecurity education resources
- Open source security tools and documentation

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: support@hackquest.com
- Documentation: [Wiki](https://github.com/your-username/DPS-Mid-Term/wiki)
