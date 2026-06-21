# PlantIQ - AI Based Plant Analysis System

## Overview

PlantIQ is an AI-powered plant analysis platform that helps users identify plant species, assess plant health, detect diseases, and receive personalized care recommendations through image analysis. The application leverages Google's Gemini AI to analyze uploaded plant images and generate detailed botanical insights.

The platform provides plant identification, disease detection, health assessment, care guidance, report generation, and analysis history management through a modern full-stack architecture.

## Features

### Plant Analysis

* AI-powered plant identification using image recognition
* Scientific and common plant name detection
* Plant health assessment and status classification
* Disease and pest detection
* Detailed condition analysis
* Personalized plant care recommendations

### User Management

* Secure user registration and authentication
* JWT-based authorization
* User profile management
* Protected routes and secure access

### Analysis Reports

* Detailed plant analysis reports
* PDF report generation
* Historical analysis tracking
* Downloadable diagnostic reports

### Care Recommendations

* Watering guidelines
* Sunlight requirements
* Fertilizer recommendations
* Maintenance and recovery suggestions

## Tech Stack

### Frontend

* React.js
* Vite
* Redux Toolkit
* TanStack Query
* React Router DOM
* Axios
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer
* PDFKit

### AI & Image Processing

* Google Gemini AI
* Sharp Image Processing

## System Architecture

```text
Frontend (React + Vite)
        |
        v
Backend (Node.js + Express)
        |
        +---- MongoDB Database
        |
        +---- Gemini AI API
        |
        +---- PDF Report Generator
```

## Project Structure

```text
PlantIQ/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── reports/
│   ├── routes/
│   ├── uploads/
│   ├── app.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── dist/
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## Installation

### Clone Repository

```bash
git clone https://github.com/Sanket-wani-08/plant-IQ

cd plantiq-ai-based-plant-analysis
```

## Backend Setup

Navigate to backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
MONGO_URL=your_mongodb_connection_string

PORT=3000

GEMINI_API_KEY=your_gemini_api_key

JWT_SECRET=your_jwt_secret_key
```

Start development server:

```bash
npm run dev
```

## Frontend Setup

Navigate to frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

## Environment Variables

### Backend

| Variable       | Description               |
| -------------- | ------------------------- |
| MONGO_URL      | MongoDB Connection String |
| PORT           | Backend Server Port       |
| GEMINI_API_KEY | Google Gemini API Key     |
| JWT_SECRET     | JWT Secret Key            |

## API Features

### Authentication

* User Registration
* User Login
* Profile Retrieval
* JWT Verification

### Plant Analysis

* Image Upload
* AI Analysis
* Disease Detection
* Care Recommendations
* Report Generation

### History Management

* Save Analysis Records
* Retrieve User History
* Download Reports

## Database Models

### User

```javascript
{
  name,
  email,
  password
}
```

### Analysis History

```javascript
{
  userId,
  plantName,
  healthStatus,
  diseaseInfo,
  reportPath,
  createdAt
}
```

## AI Analysis Output

The system provides:

* Common Plant Name
* Scientific Name
* Health Status
* Condition Description
* Disease Detection
* Watering Recommendations
* Sunlight Recommendations
* Fertilizer Suggestions
* Maintenance Guidelines

## Security Features

* Password Hashing using Bcrypt
* JWT Authentication
* Protected API Routes
* Environment Variable Protection
* Input Validation

## Deployment

### Frontend

* Vercel

### Backend

* Render

### Database

* MongoDB Atlas

## Future Enhancements

* Multi-language support
* Plant growth tracking
* Mobile application
* Plant care reminders
* Community plant sharing
* Advanced disease prediction
* Plant treatment recommendations

## Learning Outcomes

This project demonstrates practical implementation of:

* Full Stack MERN Development
* REST API Development
* JWT Authentication
* AI Integration
* Image Processing
* PDF Generation
* MongoDB Database Design
* State Management with Redux Toolkit
* Server Deployment
* Frontend Deployment

## Author

**Sanket Wani**

Computer Engineering Student | MERN Stack Developer

GitHub: https://github.com/Sanket-wani-08

LinkedIn: https://www.linkedin.com/in/sanket-wani-1a494221a/

## License

This project is developed for educational and portfolio purposes.
