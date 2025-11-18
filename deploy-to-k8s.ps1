# PowerShell script to deploy to Kubernetes
# Usage: .\deploy-to-k8s.ps1

Write-Host "Deploying to Kubernetes..." -ForegroundColor Green

# Check if kubectl is available
$kubectlCheck = Get-Command kubectl -ErrorAction SilentlyContinue
if (-not $kubectlCheck) {
    Write-Host "kubectl not found! Please install kubectl first." -ForegroundColor Red
    exit 1
}

# Apply manifests in order
Write-Host "`nCreating namespace..." -ForegroundColor Yellow
kubectl apply -f k8s/namespace.yaml

Write-Host "`nCreating secrets..." -ForegroundColor Yellow
kubectl apply -f k8s/secrets.yaml

Write-Host "`nDeploying MySQL..." -ForegroundColor Yellow
kubectl apply -f k8s/mysql-deployment.yaml

Write-Host "`nWaiting for MySQL to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "`nDeploying Backend..." -ForegroundColor Yellow
kubectl apply -f k8s/backend-deployment.yaml

Write-Host "`nDeploying Frontend..." -ForegroundColor Yellow
kubectl apply -f k8s/frontend-deployment.yaml

Write-Host "`n✅ Deployment complete!" -ForegroundColor Green
Write-Host "`nChecking pod status..." -ForegroundColor Cyan
kubectl get pods -n survey-app

Write-Host "`nChecking services..." -ForegroundColor Cyan
kubectl get svc -n survey-app

Write-Host "`nTo view logs:" -ForegroundColor Yellow
Write-Host "  kubectl logs -f deployment/backend-deployment -n survey-app"
Write-Host "  kubectl logs -f deployment/frontend-deployment -n survey-app"

