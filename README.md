# 🏛️ AI-Based Panchayat Fund Utilization Tracker

A comprehensive web application for monitoring and managing Panchayat (local government) fund utilization with AI-powered invoice verification and fraud detection capabilities.

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About

The **Fund Tracker** is a transparent and efficient system designed to track Panchayat fund allocation and utilization. It provides real-time monitoring, automated invoice processing using OCR, and AI-based fraud detection to ensure accountability in government spending.

### Key Objectives:
- 📊 **Transparency** - Real-time visibility into fund allocation and usage
- 🔍 **Fraud Detection** - AI-powered anomaly detection in invoices
- 📝 **Automation** - OCR-based invoice data extraction
- 👥 **Multi-Role Access** - Admin, Contractor, and Citizen portals
- 📈 **Analytics** - Comprehensive reporting and insights

---

## ✨ Features

### 🔐 User Management
- Role-based access control (Admin, Contractor, Citizen)
- Secure JWT authentication
- User registration and profile management

### 📊 Project Tracking
- Create and manage development projects
- Track project budget allocation
- Monitor project timelines and milestones
- Real-time project status updates

### 🧾 Invoice Management
- Upload invoice images/PDFs
- OCR-based automatic data extraction (using Tesseract)
- Invoice verification and approval workflow
- Invoice history and audit trail

### 🤖 AI-Powered Fraud Detection
- Anomaly detection in invoice amounts
- Pattern recognition for suspicious activities
- Duplicate invoice detection
- Risk scoring and alerts
- Machine learning model for fraud prediction

### 📈 Analytics Dashboard
- Real-time fund utilization metrics
- Project-wise expenditure breakdown
- Fraud detection statistics
- Visual charts and graphs
- Export reports

### 🌐 Multi-Portal System
- **Admin Dashboard** - Full system oversight and management
- **Contractor Portal** - Project execution and invoice submission
- **Citizen Portal** - Public transparency and project monitoring

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Routing**: React Router v6

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLAlchemy ORM
  - Development: SQLite
  - Production: PostgreSQL
- **Authentication**: JWT (python-jose)
- **Password Hashing**: bcrypt
- **OCR Engine**: Tesseract + OpenCV
- **AI/ML**: scikit-learn, NumPy, Pandas
- **Image Processing**: Pillow

### DevOps & Deployment
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **Database**: Render PostgreSQL
- **Version Control**: Git

---

## 🏗️ Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   React App     │────────▶│   FastAPI       │────────▶│   PostgreSQL    │
│   (Frontend)    │         │   (Backend)     │         │   (Database)    │
└─────────────────┘         └─────────────────┘         └─────────────────┘
        │                           │
        │                           ├──▶ OCR Engine (Tesseract)
        │                           │
        │                           └──▶ ML Model (Fraud Detection)
        │
        └──────────────────▶ Static Assets (Vercel)
```

### Project Structure
```
fund-tracker/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   └── lib/             # Utilities & API client
│   └── public/              # Static assets
│
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── routers/        # API endpoints
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helper functions
│   │   ├── ocr/            # OCR processing
│   │   ├── ai/             # ML models
│   │   └── config/         # Configuration
│   ├── main.py             # Application entry point
│   └── requirements.txt    # Python dependencies
│
└── README.md               # This file
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **Tesseract OCR** (for invoice processing)

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd fund-tracker
```

#### 2. Backend Setup
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo DATABASE_URL=sqlite:///./fund_tracker.db > .env
echo SECRET_KEY=your-secret-key-here >> .env
echo ALGORITHM=HS256 >> .env
echo ACCESS_TOKEN_EXPIRE_MINUTES=1440 >> .env

# Run the application
uvicorn main:app --reload
```

Backend will be available at: `http://localhost:8000`

#### 3. Frontend Setup
```bash
# Navigate to frontend (in new terminal)
cd frontend

# Install dependencies
npm install

# Create .env file
echo VITE_API_URL=http://localhost:8000 > .env

# Run development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

#### 4. Seed Default Users
```bash
# In backend directory
python seed_users.py
```

### Default Login Credentials

**Admin Account:**
- Email: `admin@panchayat.gov.in`
- Password: `admin@123`

**Contractor Account:**
- Email: `contractor@panchayat.gov.in`
- Password: `contractor@123`

---

## 🌐 Deployment

### Frontend (Vercel)
1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variable:
   - `VITE_API_URL` = Your backend URL
4. Deploy

### Backend (Render)
1. Create PostgreSQL database on Render
2. Create Web Service on Render
3. Configure environment variables:
   - `DATABASE_URL` = PostgreSQL connection URL
   - `SECRET_KEY` = Generated secret key
   - `ALGORITHM` = HS256
   - `ACCESS_TOKEN_EXPIRE_MINUTES` = 1440
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Deploy

📚 **Detailed Guide**: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for step-by-step instructions.

---

## 📖 API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Key Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

#### Projects
- `GET /projects/` - List all projects
- `POST /projects/` - Create new project
- `GET /projects/{id}` - Get project details
- `PUT /projects/{id}` - Update project
- `DELETE /projects/{id}` - Delete project

#### Invoices
- `GET /invoices/` - List all invoices
- `POST /invoices/` - Upload invoice
- `GET /invoices/{id}` - Get invoice details
- `PUT /invoices/{id}/approve` - Approve invoice
- `PUT /invoices/{id}/reject` - Reject invoice

#### Fraud Detection
- `GET /fraud/analyze/{invoice_id}` - Analyze invoice for fraud
- `GET /fraud/stats` - Get fraud statistics
- `POST /fraud/train` - Train fraud detection model

#### Users
- `GET /users/` - List all users
- `GET /users/{id}` - Get user details
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

---

## 📸 Screenshots

### Admin Dashboard
> Overview of all projects, invoices, and fraud alerts

### Project Management
> Create and track development projects

### Invoice Upload & OCR
> Upload invoices and automatically extract data

### Fraud Detection
> AI-powered fraud detection with risk scoring

### Analytics
> Comprehensive reports and visualizations

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use ESLint rules for TypeScript/React
- Write descriptive commit messages
- Add tests for new features
- Update documentation as needed

---

## 🐛 Known Issues & Limitations

- **File Storage**: Render uses ephemeral storage. For production, integrate AWS S3 or Cloudinary
- **Free Tier**: Backend sleeps after 15 minutes of inactivity (30s wake time)
- **OCR Accuracy**: Depends on invoice image quality
- **ML Model**: Requires training data for optimal fraud detection

---

## 🔮 Future Enhancements

- [ ] Mobile application (React Native)
- [ ] Email notifications for approvals
- [ ] SMS alerts for fraud detection
- [ ] Integration with government payment systems
- [ ] Blockchain for immutable records
- [ ] Advanced analytics with AI insights
- [ ] Multi-language support
- [ ] Offline mode support

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- Your Name - *Initial work*

---

## 🙏 Acknowledgments

- FastAPI for the excellent web framework
- shadcn/ui for beautiful UI components
- Tesseract for OCR capabilities
- OpenCV for image processing
- scikit-learn for machine learning

---

## 📞 Support

For support, email support@fundtracker.com or open an issue in the repository.

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ for transparent governance

</div>
