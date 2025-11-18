# Jenkins CI/CD Setup Guide - Step by Step

## Prerequisites
- ✅ Jenkins server running (from previous assignment)
- ✅ GitHub repository for this project
- ✅ Docker Hub account: `divyanshidetroja`
- ✅ Kubernetes cluster accessible from Jenkins

## Step 1: Push Project to GitHub (Do This First!)

### 1.1 Initialize Git Repository (if not already done)
```powershell
# In your project root (A3-SWE645)
git init
git add .
git commit -m "Initial commit: SWE645 Assignment 3 - Full stack survey app with K8s"
```

### 1.2 Create GitHub Repository
1. Go to https://github.com
2. Click "New repository"
3. Name: `A3-SWE645` or `swe645-assignment3`
4. **Don't** initialize with README (you already have one)
5. Click "Create repository"

### 1.3 Push to GitHub
```powershell
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/A3-SWE645.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username**

## Step 2: Configure Jenkins

### 2.1 Access Jenkins
1. Open your Jenkins URL (from previous assignment)
2. Login with your credentials

### 2.2 Install Required Plugins (if not already installed)
1. Go to **Manage Jenkins** → **Manage Plugins**
2. Check if these are installed:
   - ✅ Git plugin
   - ✅ Docker Pipeline plugin
   - ✅ Kubernetes plugin
   - ✅ Credentials Binding plugin
3. If missing, install them and restart Jenkins

### 2.3 Create Docker Hub Credentials
1. Go to **Manage Jenkins** → **Manage Credentials**
2. Click on your domain (usually "global")
3. Click **Add Credentials**
4. Fill in:
   - **Kind**: Username with password
   - **Scope**: Global
   - **Username**: `divyanshidetroja` (your Docker Hub username)
   - **Password**: Your Docker Hub password
   - **ID**: `docker-credentials` (must match Jenkinsfile!)
   - **Description**: "Docker Hub credentials for survey app"
5. Click **OK**

### 2.4 Create Kubernetes Config Credentials
1. Still in **Manage Credentials**
2. Click **Add Credentials**
3. Fill in:
   - **Kind**: Secret file
   - **Scope**: Global
   - **File**: Upload your Kubernetes config file
     - On Windows, usually at: `C:\Users\Hp\.kube\config`
   - **ID**: `kubeconfig` (must match Jenkinsfile!)
   - **Description**: "Kubernetes config for survey-app deployment"
4. Click **OK**

**Alternative**: If you don't have kubeconfig file:
```powershell
# Get your kubeconfig
kubectl config view --flatten > kubeconfig.yaml
# Then upload this file in Jenkins
```

## Step 3: Create Jenkins Pipeline Job

### 3.1 Create New Item
1. In Jenkins dashboard, click **New Item**
2. Enter name: `survey-app-pipeline` (or any name you prefer)
3. Select **Pipeline**
4. Click **OK**

### 3.2 Configure Pipeline
1. **Description**: "CI/CD Pipeline for SWE645 Assignment 3 - Student Survey Application"

2. **Pipeline Definition**:
   - Select: **Pipeline script from SCM**
   - **SCM**: Git
   - **Repository URL**: `https://github.com/YOUR_USERNAME/A3-SWE645.git`
     - Replace `YOUR_USERNAME` with your GitHub username
   - **Credentials**: If repo is private, add GitHub credentials
   - **Branches to build**: `*/main` (or `*/master` if using master)
   - **Script Path**: `Jenkinsfile` (this is the default, should be correct)

3. **Build Triggers** (Optional):
   - ✅ **Poll SCM**: `H/5 * * * *` (checks every 5 minutes for changes)
   - OR
   - ✅ **GitHub hook trigger for GITScm polling** (if you set up webhooks)

4. Click **Save**

## Step 4: Test the Pipeline

### 4.1 Run Pipeline Manually
1. Click on your pipeline job
2. Click **Build Now**
3. Watch the build progress in **Build History**

### 4.2 Check Build Logs
1. Click on the build number (#1, #2, etc.)
2. Click **Console Output**
3. Watch for any errors

### 4.3 Verify Deployment
After pipeline completes:
```powershell
# Check if pods are running
kubectl get pods -n survey-app

# Check services
kubectl get svc -n survey-app
```

## Step 5: Troubleshooting

### Common Issues:

#### Issue: "docker-credentials not found"
**Solution**: Make sure credential ID is exactly `docker-credentials` (case-sensitive)

#### Issue: "kubeconfig not found"
**Solution**: 
- Verify credential ID is `kubeconfig`
- Check that kubeconfig file is valid
- Test: `kubectl --kubeconfig=/path/to/config get nodes`

#### Issue: "Cannot connect to Docker registry"
**Solution**:
- Verify Docker Hub credentials are correct
- Check if images are public or if credentials have access

#### Issue: "kubectl command not found"
**Solution**:
- Install kubectl on Jenkins server
- Or use Kubernetes plugin with proper configuration

#### Issue: "Permission denied" for kubectl
**Solution**:
- Ensure Jenkins user has access to Kubernetes cluster
- Check kubeconfig permissions

## Step 6: Automatic Deployment

Once working, every time you push to GitHub:
1. Jenkins will detect the change (if Poll SCM is enabled)
2. Automatically build images
3. Push to Docker Hub
4. Deploy to Kubernetes

## Quick Reference

### Manual Pipeline Trigger
```powershell
# Push changes to trigger pipeline
git add .
git commit -m "Update application"
git push origin main
```

### Check Pipeline Status
- Jenkins Dashboard → Your Pipeline → Build History

### View Application
- Frontend: http://localhost (or your LoadBalancer IP)
- Backend: http://localhost:8000/docs (via port-forward)

## Summary Checklist

- [ ] Project pushed to GitHub
- [ ] Docker Hub credentials added to Jenkins (`docker-credentials`)
- [ ] Kubernetes config added to Jenkins (`kubeconfig`)
- [ ] Pipeline job created in Jenkins
- [ ] Pipeline configured to use GitHub repo
- [ ] First build triggered and successful
- [ ] Application deployed and accessible
