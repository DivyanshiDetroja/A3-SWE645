# Deployment Guide - SWE645 Assignment 3

## Important Note About JAR Files

**You do NOT need JAR files** - JAR files are for Java applications. Since we're using:
- **Backend**: Python (FastAPI) → Docker image
- **Frontend**: React (JavaScript) → Docker image

We use **Docker images** instead of JAR files.

## Submission Structure

Your submission should include:

```
A3-SWE645/
├── backend/              # Backend source code
│   ├── app/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/             # Frontend source code
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── k8s/                  # Kubernetes manifests
│   ├── namespace.yaml
│   ├── secrets.yaml
│   ├── mysql-deployment.yaml
│   ├── backend-deployment.yaml
│   └── frontend-deployment.yaml
├── docker-compose.yaml    # Local development
├── Jenkinsfile           # CI/CD pipeline
├── build-and-push.sh     # Build script
├── README.md
└── DEPLOYMENT.md         # This file
```

## Docker Images (Not JAR Files)

### Building Docker Images

1. **Backend Image:**
   ```bash
   cd backend
   docker build -t survey-backend:latest .
   ```

2. **Frontend Image:**
   ```bash
   cd frontend
   docker build -t survey-frontend:latest .
   ```

3. **Using the build script:**
   ```bash
   chmod +x build-and-push.sh
   ./build-and-push.sh your-dockerhub-username latest
   ```

### Pushing to Docker Registry

You need to push images to a registry (Docker Hub, AWS ECR, etc.):

```bash
# Login to Docker Hub
docker login

# Tag images
docker tag survey-backend:latest your-username/survey-backend:latest
docker tag survey-frontend:latest your-username/survey-frontend:latest

# Push images
docker push your-username/survey-backend:latest
docker push your-username/survey-frontend:latest
```

## Kubernetes Deployment

### Prerequisites

1. Kubernetes cluster (local with minikube/kind or cloud)
2. kubectl configured
3. Docker images pushed to accessible registry

### Deployment Steps

1. **Update image names in Kubernetes manifests:**
   - Edit `k8s/backend-deployment.yaml` - replace `your-registry/survey-backend:latest`
   - Edit `k8s/frontend-deployment.yaml` - replace `your-registry/survey-frontend:latest`

2. **Deploy to Kubernetes:**
   ```bash
   # Create namespace
   kubectl apply -f k8s/namespace.yaml
   
   # Create secrets
   kubectl apply -f k8s/secrets.yaml
   
   # Deploy MySQL
   kubectl apply -f k8s/mysql-deployment.yaml
   
   # Deploy Backend
   kubectl apply -f k8s/backend-deployment.yaml
   
   # Deploy Frontend
   kubectl apply -f k8s/frontend-deployment.yaml
   ```

3. **Check deployment status:**
   ```bash
   kubectl get pods -n survey-app
   kubectl get svc -n survey-app
   ```

4. **Get frontend URL:**
   ```bash
   # For LoadBalancer
   kubectl get svc frontend-service -n survey-app
   
   # For NodePort (local)
   kubectl get svc frontend-service -n survey-app -o jsonpath='{.spec.ports[0].nodePort}'
   ```

## CI/CD Pipeline (Jenkins)

### Setup

1. **Jenkins Credentials:**
   - `docker-credentials`: Docker registry username/password
   - `kubeconfig`: Kubernetes config file

2. **Update Jenkinsfile:**
   - Replace `your-registry` with your Docker registry
   - Update credentials IDs if needed

3. **Run Pipeline:**
   - Jenkins will automatically build, push, and deploy

## Local Testing with Docker Compose

```bash
docker-compose up -d
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

## What to Submit

### Required Files:
- ✅ All source code (backend/ and frontend/)
- ✅ Dockerfiles (backend/Dockerfile, frontend/Dockerfile)
- ✅ Kubernetes manifests (k8s/*.yaml)
- ✅ Jenkinsfile
- ✅ docker-compose.yaml
- ✅ README.md with setup instructions
- ✅ DEPLOYMENT.md (this file)
- ✅ Video demonstration

### NOT Required:
- ❌ JAR files (we use Docker images)
- ❌ node_modules/ (excluded via .dockerignore)
- ❌ venv/ (excluded via .dockerignore)

## Troubleshooting

### Images not pulling in Kubernetes:
- Check image name in deployment matches registry
- Verify imagePullPolicy (use `Never` for local testing)
- Check registry credentials

### Pods not starting:
- Check logs: `kubectl logs <pod-name> -n survey-app`
- Verify secrets are created
- Check resource limits

### Services not accessible:
- Verify service type (LoadBalancer vs NodePort)
- Check firewall rules
- Verify port mappings

## Application URL

After deployment, provide the URL in your README:
```
Frontend URL: http://your-loadbalancer-ip or http://node-ip:nodeport
Backend API: http://backend-service.survey-app.svc.cluster.local:8000
```

