# PowerShell script to build and push Docker images
# Usage: .\build-and-push-images.ps1

$DOCKER_USERNAME = "divyanshidetroja"
$IMAGE_TAG = "latest"

Write-Host "Building and pushing images to Docker Hub..." -ForegroundColor Green
Write-Host "Docker Hub Username: $DOCKER_USERNAME" -ForegroundColor Cyan

# Login to Docker Hub
Write-Host "`nLogging into Docker Hub..." -ForegroundColor Yellow
docker login

if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker login failed!" -ForegroundColor Red
    exit 1
}

# Build and push backend
Write-Host "`nBuilding backend image..." -ForegroundColor Yellow
Set-Location backend
docker build -t "${DOCKER_USERNAME}/survey-backend:${IMAGE_TAG}" .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend build failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host "Pushing backend image..." -ForegroundColor Yellow
docker push "${DOCKER_USERNAME}/survey-backend:${IMAGE_TAG}"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend push failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..

# Build and push frontend
Write-Host "`nBuilding frontend image..." -ForegroundColor Yellow
Set-Location frontend
docker build -t "${DOCKER_USERNAME}/survey-frontend:${IMAGE_TAG}" .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend build failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host "Pushing frontend image..." -ForegroundColor Yellow
docker push "${DOCKER_USERNAME}/survey-frontend:${IMAGE_TAG}"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend push failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..

Write-Host "`n✅ Successfully built and pushed all images!" -ForegroundColor Green
Write-Host "Images:" -ForegroundColor Cyan
Write-Host "  - ${DOCKER_USERNAME}/survey-backend:${IMAGE_TAG}"
Write-Host "  - ${DOCKER_USERNAME}/survey-frontend:${IMAGE_TAG}"

