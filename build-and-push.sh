#!/bin/bash

# Script to build and push Docker images
# Usage: ./build-and-push.sh [registry] [tag]

REGISTRY=${1:-"your-registry"}  # Default to 'your-registry', update with your Docker registry
TAG=${2:-"latest"}

echo "Building and pushing images to ${REGISTRY} with tag ${TAG}"

# Build backend image
echo "Building backend image..."
cd backend
docker build -t ${REGISTRY}/survey-backend:${TAG} .
docker tag ${REGISTRY}/survey-backend:${TAG} ${REGISTRY}/survey-backend:latest
cd ..

# Build frontend image
echo "Building frontend image..."
cd frontend
docker build -t ${REGISTRY}/survey-frontend:${TAG} .
docker tag ${REGISTRY}/survey-frontend:${TAG} ${REGISTRY}/survey-frontend:latest
cd ..

# Push images (uncomment when ready to push)
# echo "Pushing images..."
# docker push ${REGISTRY}/survey-backend:${TAG}
# docker push ${REGISTRY}/survey-backend:latest
# docker push ${REGISTRY}/survey-frontend:${TAG}
# docker push ${REGISTRY}/survey-frontend:latest

echo "Build complete! Images:"
echo "  - ${REGISTRY}/survey-backend:${TAG}"
echo "  - ${REGISTRY}/survey-frontend:${TAG}"

