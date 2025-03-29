#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
API_URL=$1
FRONTEND_URL=$2

echo "Testing deployment..."
echo "API URL: $API_URL"
echo "Frontend URL: $FRONTEND_URL"

# Test API health endpoint
echo -e "\nTesting API health endpoint..."
HEALTH_RESPONSE=$(curl -s -w "%{http_code}" "$API_URL/health")
HEALTH_STATUS=${HEALTH_RESPONSE: -3}
HEALTH_BODY=${HEALTH_RESPONSE:0:${#HEALTH_RESPONSE}-3}

if [ "$HEALTH_STATUS" = "200" ]; then
  echo -e "${GREEN}✓ API health check passed${NC}"
else
  echo -e "${RED}✗ API health check failed${NC}"
  echo "Response: $HEALTH_BODY"
  exit 1
fi

# Test frontend accessibility
echo -e "\nTesting frontend accessibility..."
FRONTEND_RESPONSE=$(curl -s -w "%{http_code}" "$FRONTEND_URL")
FRONTEND_STATUS=${FRONTEND_RESPONSE: -3}
FRONTEND_BODY=${FRONTEND_RESPONSE:0:${#FRONTEND_RESPONSE}-3}

if [ "$FRONTEND_STATUS" = "200" ]; then
  echo -e "${GREEN}✓ Frontend accessibility check passed${NC}"
else
  echo -e "${RED}✗ Frontend accessibility check failed${NC}"
  echo "Response: $FRONTEND_BODY"
  exit 1
fi

# Test API authentication
echo -e "\nTesting API authentication..."
AUTH_RESPONSE=$(curl -s -w "%{http_code}" -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}')
AUTH_STATUS=${AUTH_RESPONSE: -3}
AUTH_BODY=${AUTH_RESPONSE:0:${#AUTH_RESPONSE}-3}

if [ "$AUTH_STATUS" = "401" ]; then
  echo -e "${GREEN}✓ API authentication check passed${NC}"
else
  echo -e "${RED}✗ API authentication check failed${NC}"
  echo "Response: $AUTH_BODY"
  exit 1
fi

echo -e "\n${GREEN}All deployment tests passed successfully!${NC}" 