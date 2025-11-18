# Kubernetes Setup Guide - Replacing "your-registry"

## What is a Docker Registry?

A Docker registry is where you store your Docker images so Kubernetes can pull them. Think of it like a library where your images are stored.

## Where to Replace "your-registry"

You need to replace `your-registry` in **2 files**:

1. `k8s/backend-deployment.yaml` - Line 20
2. `k8s/frontend-deployment.yaml` - Line 20

## Option 1: Docker Hub (Easiest - Recommended for Students)

### Step 1: Create Docker Hub Account
1. Go to https://hub.docker.com
2. Sign up for a free account
3. Your username will be something like `johndoe` or `student123`

### Step 2: Build and Push Images
```bash
# Login to Docker Hub
docker login

# Build and tag backend
cd backend
docker build -t YOUR_DOCKERHUB_USERNAME/survey-backend:latest .
docker push YOUR_DOCKERHUB_USERNAME/survey-backend:latest

# Build and tag frontend
cd ../frontend
docker build -t YOUR_DOCKERHUB_USERNAME/survey-frontend:latest .
docker push YOUR_DOCKERHUB_USERNAME/survey-frontend:latest
```

### Step 3: Update Kubernetes Files

**In `k8s/backend-deployment.yaml` (line 20):**
```yaml
image: YOUR_DOCKERHUB_USERNAME/survey-backend:latest
```

**Example:**
```yaml
image: johndoe/survey-backend:latest
```

**In `k8s/frontend-deployment.yaml` (line 20):**
```yaml
image: YOUR_DOCKERHUB_USERNAME/survey-frontend:latest
```

**Example:**
```yaml
image: johndoe/survey-frontend:latest
```

---

## Option 2: AWS ECR (If Using AWS)

### Step 1: Create ECR Repository
```bash
aws ecr create-repository --repository-name survey-backend
aws ecr create-repository --repository-name survey-frontend
```

### Step 2: Get ECR URL
Your ECR URL will look like:
```
123456789012.dkr.ecr.us-east-1.amazonaws.com
```

### Step 3: Build and Push
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com

# Build and push
docker build -t 123456789012.dkr.ecr.us-east-1.amazonaws.com/survey-backend:latest ./backend
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/survey-backend:latest
```

### Step 4: Update Kubernetes Files
```yaml
image: 123456789012.dkr.ecr.us-east-1.amazonaws.com/survey-backend:latest
```

---

## Option 3: Local Testing (Minikube/Kind)

If testing locally with minikube or kind, you can use local images:

### Step 1: Build Images Locally
```bash
# Build without pushing
cd backend
docker build -t survey-backend:latest .

cd ../frontend
docker build -t survey-frontend:latest .
```

### Step 2: Load into Minikube/Kind
```bash
# For Minikube
minikube image load survey-backend:latest
minikube image load survey-frontend:latest

# For Kind
kind load docker-image survey-backend:latest
kind load docker-image survey-frontend:latest
```

### Step 3: Update Kubernetes Files
```yaml
image: survey-backend:latest
imagePullPolicy: Never  # Important! Tells Kubernetes not to pull from registry
```

---

## Quick Reference: What to Replace

### File: `k8s/backend-deployment.yaml`
**Line 20:**
```yaml
# BEFORE:
image: your-registry/survey-backend:latest

# AFTER (Docker Hub example):
image: johndoe/survey-backend:latest

# OR (Local testing):
image: survey-backend:latest
imagePullPolicy: Never
```

### File: `k8s/frontend-deployment.yaml`
**Line 20:**
```yaml
# BEFORE:
image: your-registry/survey-frontend:latest

# AFTER (Docker Hub example):
image: johndoe/survey-frontend:latest

# OR (Local testing):
image: survey-frontend:latest
imagePullPolicy: Never
```

---

## Complete Example: Docker Hub Setup

Let's say your Docker Hub username is `student2024`:

1. **Build and push:**
   ```bash
   docker login
   docker build -t student2024/survey-backend:latest ./backend
   docker push student2024/survey-backend:latest
   docker build -t student2024/survey-frontend:latest ./frontend
   docker push student2024/survey-frontend:latest
   ```

2. **Update `k8s/backend-deployment.yaml`:**
   ```yaml
   image: student2024/survey-backend:latest
   ```

3. **Update `k8s/frontend-deployment.yaml`:**
   ```yaml
   image: student2024/survey-frontend:latest
   ```

4. **Deploy:**
   ```bash
   kubectl apply -f k8s/
   ```

---

## Troubleshooting

### Error: "ImagePullBackOff"
- Check if image exists in registry: `docker pull YOUR_IMAGE_NAME`
- Verify image name matches exactly in Kubernetes manifest
- Check if you're logged into registry

### Error: "ErrImagePull"
- Verify registry URL is correct
- Check if imagePullPolicy is set correctly
- For local testing, use `imagePullPolicy: Never`

### For Local Testing
If using minikube/kind, make sure to:
1. Use `imagePullPolicy: Never`
2. Load images into cluster first
3. Use simple image names (no registry prefix)

---

## Summary

**Replace `your-registry` with:**
- **Docker Hub**: `your-dockerhub-username`
- **AWS ECR**: `123456789012.dkr.ecr.region.amazonaws.com`
- **Local**: Just use image name and set `imagePullPolicy: Never`

The format is: `REGISTRY/IMAGE_NAME:TAG`

