#!/bin/bash

# Build the Docker image
docker build -t aquasurveyor-backend .

# Tag the image for Amazon ECR
docker tag aquasurveyor-backend:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/aquasurveyor-backend:latest

# Get ECR login token and login
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Push the image to ECR
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/aquasurveyor-backend:latest

# Update the ECS service to use the new image
aws ecs update-service --cluster aquasurveyor-cluster --service aquasurveyor-backend --force-new-deployment 