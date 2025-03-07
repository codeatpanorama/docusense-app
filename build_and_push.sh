#!/bin/bash

# Exit on error
set -e

# Configuration
DOCKER_USERNAME="madhavpandey33"  # Replace with your Docker Hub username
IMAGE_NAME="docusense-app"                 # Replace with your image name
PLATFORM="linux/amd64"                     # AMD64 platform

# Generate tag based on current month and date
TAG=$(date +"%m_%d_amd")
FULL_IMAGE_NAME="$DOCKER_USERNAME/$IMAGE_NAME:$TAG"

echo "===== Building application ====="
npm run build

echo "===== Building Docker image for $PLATFORM ====="
docker buildx build --platform $PLATFORM -t $FULL_IMAGE_NAME .

echo "===== Logging in to Docker Hub ====="
# You can either use docker login interactively or store credentials in a secure way
# For CI/CD, consider using secrets management
docker login

echo "===== Pushing image to Docker Hub ====="
docker push $FULL_IMAGE_NAME

echo "===== Process completed successfully ====="
echo "Image pushed: $FULL_IMAGE_NAME" 