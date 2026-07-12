# Interview AI YT

AI-powered interview preparation app with a React frontend and Node.js/Express backend connected to MongoDB.

## Features
- User registration, login, logout, and session handling
- AI-generated interview reports from resume, self-description, and job description
- Resume-to-PDF generation
- Saved interview reports and report history

## Tech Stack
- Frontend: React, Vite, React Router, Axios, Sass
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- AI/PDF: Google Gemini API, Puppeteer, Zod

## Project Structure
- `Backend/` - Express API, database models, controllers, and AI services
- `Frontend/` - React app, pages, components, and styles

## Environment Variables

### Backend
Create `Backend/.env` with:
```env
MONGO_DB=mongodb://127.0.0.1:27017/interview-ai-yt
LOCAL_MONGO_URI=mongodb://127.0.0.1:27017/interview-ai-yt
JWT_SECRET=your_secret_here
GEMINI_API_KEY=your_gemini_key_here
CLIENT_ORIGIN=http://localhost:5173
PORT=3000
NODE_ENV=development
```

### Frontend
Create `Frontend/.env` with:
```env
VITE_API_BASE_URL=http://localhost:3000
```

## Run Locally

### Backend
```bash
cd Backend
npm install
npm run dev
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
```

## Build

### Frontend production build
```bash
cd Frontend
npm run build
```

## Deployment Notes
- This repo includes `render.yaml` for deploying both services on Render.
- Render service names used in the blueprint:
  - `interview-ai-backend`
  - `interview-ai-frontend`
- Backend env on Render:
  - `MONGO_DB`
  - `JWT_SECRET`
  - `GEMINI_API_KEY`
- Frontend env on Render:
  - `VITE_API_BASE_URL`
- In production, `CLIENT_ORIGIN` should match the deployed frontend URL.

## Git Ignore
Common local files are ignored through the root `.gitignore`, plus backend/frontend-specific ignore files.
