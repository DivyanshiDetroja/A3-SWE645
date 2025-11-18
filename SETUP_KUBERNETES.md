# Setting Up Kubernetes Cluster

## Option 1: Docker Desktop Kubernetes (Recommended for Windows)

### Step 1: Enable Kubernetes in Docker Desktop

1. Open **Docker Desktop**
2. Go to **Settings** (gear icon)
3. Click **Kubernetes** in the left sidebar
4. Check **"Enable Kubernetes"**
5. Click **"Apply & Restart"**
6. Wait for Kubernetes to start (green indicator)

### Step 2: Verify Setup

```powershell
kubectl cluster-info
kubectl get nodes
```

You should see your cluster information.

---

## Option 2: Minikube (Alternative)

### Install Minikube

```powershell
# Using Chocolatey (if installed)
choco install minikube

# Or download from: https://minikube.sigs.k8s.io/docs/start/
```

### Start Minikube

```powershell
minikube start
minikube status
```

---

## Option 3: Kind (Kubernetes in Docker)

### Install Kind

```powershell
# Using Chocolatey
choco install kind

# Or download from: https://kind.sigs.k8s.io/docs/user/quick-start/
```

### Create Cluster

```powershell
kind create cluster --name survey-cluster
kubectl cluster-info --context kind-survey-cluster
```

---

## Option 4: Cloud Provider (AWS EKS, GKE, AKS)

If using a cloud provider, you'll need to:
1. Create a cluster in your cloud provider
2. Configure kubectl to connect to it
3. Follow provider-specific setup instructions

---

## After Setting Up Cluster

Once you have a cluster running:

1. **Verify connection:**
   ```powershell
   kubectl get nodes
   ```

2. **Deploy your application:**
   ```powershell
   .\deploy-to-k8s.ps1
   ```

3. **Check status:**
   ```powershell
   kubectl get pods -n survey-app
   kubectl get svc -n survey-app
   ```

