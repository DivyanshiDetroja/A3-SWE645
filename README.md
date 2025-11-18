# Student Survey Application - SWE645 Assignment 3

A full-stack web application for managing student surveys with CRUD operations, built with React, FastAPI, MySQL, and Docker.

## ⚠️ Important: About JAR Files

**You do NOT need JAR files for this project!** JAR files are for Java applications. Since we're using:
- **Backend**: Python (FastAPI) → Uses **Docker images**
- **Frontend**: React (JavaScript) → Uses **Docker images**

We containerize using **Docker images** (not JAR files). See `DEPLOYMENT.md` for details.

## Architecture

- **Frontend**: React + Vite
- **Backend**: FastAPI (Python)
- **Database**: MySQL 8.0
- **Containerization**: Docker & Docker Compose

## Features

- ✅ Create, Read, Update, Delete (CRUD) operations for surveys
- ✅ Filter surveys by name and date
- ✅ Form validation with real-time feedback
- ✅ Toast notifications for all operations
- ✅ Responsive design with GMU branding
- ✅ Fully containerized with Docker

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## Quick Start

### Production (Docker Compose)

1. **Start all services:**
   ```bash
   docker-compose up -d
   ```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

3. **Stop all services:**
   ```bash
   docker-compose down
   ```

4. **View logs:**
   ```bash
   docker-compose logs -f
   ```

### Development Mode

For development with hot reloading:

```bash
docker-compose -f docker-compose.dev.yaml up
```

## Project Structure

```
A3-SWE645/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI application
│   │   ├── models.py         # SQLModel database models
│   │   ├── database.py       # Database configuration
│   │   ├── crud.py           # CRUD operations
│   │   └── schemas.py        # Pydantic schemas
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env                  # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── StudentSurvey.jsx  # Create/Edit form
│   │   │   ├── ListSurveys.jsx    # List view
│   │   │   ├── ViewSurvey.jsx     # Detail view
│   │   │   └── Header.jsx         # Navigation
│   │   └── App.jsx
│   ├── Dockerfile
│   ├── Dockerfile.dev        # Development Dockerfile
│   ├── nginx.conf            # Nginx configuration
│   └── package.json
├── k8s/                      # Kubernetes manifests
├── docker-compose.yaml       # Production compose
├── docker-compose.dev.yaml   # Development compose
└── README.md
```

## API Endpoints

- `GET /surveys/` - List all surveys
- `POST /surveys/` - Create a new survey
- `GET /surveys/{id}` - Get survey by ID
- `PUT /surveys/{id}` - Update survey
- `DELETE /surveys/{id}` - Delete survey

## Environment Variables

### Backend (.env)
```
DB_HOST=mysql
DB_USER=root
DB_PASSWORD=password
DB_NAME=survey_db
```

## Building Individual Services

### Backend
```bash
cd backend
docker build -t survey-backend .
```

### Frontend
```bash
cd frontend
docker build -t survey-frontend .
```

## Troubleshooting

### MySQL Connection Issues
- Ensure MySQL container is healthy: `docker-compose ps`
- Check MySQL logs: `docker-compose logs mysql`
- Wait for MySQL to be fully ready (healthcheck passes)

### Frontend Not Loading
- Check if frontend container is running: `docker ps`
- View frontend logs: `docker-compose logs frontend`
- Ensure port 3000 is not in use

### Backend Errors
- Check backend logs: `docker-compose logs backend`
- Verify database credentials match docker-compose.yaml
- Ensure MySQL is accessible from backend container

## Development Setup (Without Docker)

### Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows
pip install -r requirements.txt
python -m app.main
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Kubernetes Deployment

The application is deployed on Kubernetes. Access it at:

**Frontend URL**: http://localhost (or http://localhost:31871 if using NodePort)

To get the exact URL:
```bash
kubectl get svc -n survey-app frontend-service
```

**Backend API**: http://localhost:8000/docs (via port-forward)
```bash
kubectl port-forward -n survey-app svc/backend-service 8000:8000
```

## CI/CD Pipeline

The project includes a `Jenkinsfile` for automated CI/CD. To use it:

1. **Configure Jenkins** (from your previous assignment):
   - Add credentials: `docker-credentials` (Docker Hub)
   - Add credentials: `kubeconfig` (Kubernetes config)
   - Connect Jenkins to your Git repository

2. **Pipeline automatically**:
   - Builds Docker images
   - Pushes to Docker Hub
   - Updates Kubernetes manifests
   - Deploys to Kubernetes cluster

**Note**: If Jenkins is not available, you can manually deploy using:
```bash
kubectl apply -f k8s/
```

## Authors

- Divyanshi Detroja (G01522554)
- Yashwanth Katanguri (G01514418)
- Aditi Srivastava (G01525340)

## License

SWE645 Assignment 3

