# Quick Example: How to Update Kubernetes Manifests

## Step-by-Step Example

Let's say you created a Docker Hub account with username: `mystudent123`

### Step 1: Build and Push Your Images

```bash
# Login to Docker Hub
docker login
# Enter your Docker Hub username and password

# Build backend image
cd backend
docker build -t mystudent123/survey-backend:latest .
docker push mystudent123/survey-backend:latest

# Build frontend image
cd ../frontend
docker build -t mystudent123/survey-frontend:latest .
docker push mystudent123/survey-frontend:latest
```

### Step 2: Update `k8s/backend-deployment.yaml`

**Find this line (around line 20):**
```yaml
image: your-registry/survey-backend:latest
```

**Change it to:**
```yaml
image: mystudent123/survey-backend:latest
```

### Step 3: Update `k8s/frontend-deployment.yaml`

**Find this line (around line 20):**
```yaml
image: your-registry/survey-frontend:latest
```

**Change it to:**
```yaml
image: mystudent123/survey-frontend:latest
```

## Visual Example

### BEFORE (k8s/backend-deployment.yaml):
```yaml
      containers:
      - name: backend
        image: your-registry/survey-backend:latest  # ❌ Replace this
        imagePullPolicy: Always
```

### AFTER (k8s/backend-deployment.yaml):
```yaml
      containers:
      - name: backend
        image: mystudent123/survey-backend:latest  # ✅ Updated!
        imagePullPolicy: Always
```

## That's It!

After making these 2 changes, your Kubernetes cluster will know where to find your Docker images.

## For Local Testing (No Registry Needed)

If you're testing locally with minikube/kind and don't want to use a registry:

1. **Build images locally:**
   ```bash
   docker build -t survey-backend:latest ./backend
   docker build -t survey-frontend:latest ./frontend
   ```

2. **Load into your cluster:**
   ```bash
   # For minikube
   minikube image load survey-backend:latest
   minikube image load survey-frontend:latest
   ```

3. **Update manifests to:**
   ```yaml
   image: survey-backend:latest
   imagePullPolicy: Never  # Don't try to pull from registry
   ```

