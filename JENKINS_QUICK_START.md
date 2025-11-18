# Jenkins Setup - Quick Start Guide

## ✅ Step 1: Push to GitHub (Do This First!)

Your repo is already connected: `https://github.com/DivyanshiDetroja/A3-SWE645.git`

**Run these commands:**
```powershell
git add .
git commit -m "Complete SWE645 Assignment 3: Full stack app with K8s and CI/CD"
git push origin main
```

## ✅ Step 2: Configure Jenkins Credentials

### 2.1 Docker Hub Credentials
1. Jenkins → **Manage Jenkins** → **Manage Credentials**
2. Click your domain (usually "global")
3. **Add Credentials**:
   - **Kind**: Username with password
   - **Username**: `divyanshidetroja`
   - **Password**: [Your Docker Hub password]
   - **ID**: `docker-credentials` ⚠️ **Must be exact!**
   - **Description**: "Docker Hub for survey app"
4. Click **OK**

### 2.2 Kubernetes Config
1. Still in **Manage Credentials**
2. **Add Credentials**:
   - **Kind**: Secret file
   - **File**: Upload `C:\Users\Hp\.kube\config`
   - **ID**: `kubeconfig` ⚠️ **Must be exact!**
   - **Description**: "Kubernetes config"
3. Click **OK**

**OR** create kubeconfig file:
```powershell
kubectl config view --flatten > kubeconfig.yaml
# Then upload this file in Jenkins
```

## ✅ Step 3: Create Jenkins Pipeline

1. Jenkins Dashboard → **New Item**
2. Name: `survey-app-pipeline`
3. Type: **Pipeline** → **OK**

### Configure:
- **Description**: "SWE645 Assignment 3 - Student Survey App CI/CD"
- **Pipeline** → **Definition**: Pipeline script from SCM
- **SCM**: Git
- **Repository URL**: `https://github.com/DivyanshiDetroja/A3-SWE645.git`
- **Credentials**: (Add if repo is private)
- **Branches**: `*/main`
- **Script Path**: `Jenkinsfile` (default)

### Build Triggers (Optional):
- ✅ **Poll SCM**: `H/5 * * * *` (checks every 5 min)

Click **Save**

## ✅ Step 4: Run Pipeline

1. Click on `survey-app-pipeline`
2. Click **Build Now**
3. Watch **Build History** → Click build number → **Console Output**

## ✅ Step 5: Verify

After build completes:
```powershell
kubectl get pods -n survey-app
kubectl get svc -n survey-app
```

## 🎯 That's It!

Your CI/CD is now set up. Every push to GitHub will:
1. Build Docker images
2. Push to Docker Hub
3. Deploy to Kubernetes

## Troubleshooting

**"docker-credentials not found"**
→ Check credential ID is exactly `docker-credentials`

**"kubeconfig not found"**
→ Check credential ID is exactly `kubeconfig`

**"Cannot connect to registry"**
→ Verify Docker Hub username/password

**"kubectl not found"**
→ Install kubectl on Jenkins server or use Kubernetes plugin

