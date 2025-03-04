#!/bin/bash

# =======================================================
# velociType Local Setup Script
# -------------------------------------------------------
# This script automates the installation and setup steps 
# for the velociType project.
#
# Prerequisites:
#   - Node.js (v18+)
#   - npm (or yarn) installed globally
#   - Git installed
#   - PostgreSQL running and accessible
#   - Redis running locally or appropriate Upstash credentials
# =======================================================

# Exit immediately if a command exits with a non-zero status.
set -e

# Define colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Starting VelociType Setup ===${NC}"

# Define directories
ROOT_DIR=$(pwd)
VELOCITY_DIR="apps/velocity"
WEB_DIR="apps/web"

# 1. Install dependencies in the monorepo root
echo -e "${YELLOW}Installing root dependencies...${NC}"
npm install

# 2. Install dependencies in the web app directory
if [ -d "$VELOCITY_DIR" ]; then
  echo -e "${YELLOW}Installing dependencies in $VELOCITY_DIR...${NC}"
  cd $VELOCITY_DIR
  npm install
  cd $ROOT_DIR
else
  echo -e "${RED}Directory $VELOCITY_DIR not found. Please check your repository structure.${NC}"
  exit 1
fi

# 3. Configure environment variables
# Check if a .env file exists in $WEB_DIR; if not, copy from .env.example
for ENV_FILE in ".env" ".env.local"; do
  if [ ! -f "$WEB_DIR/$ENV_FILE" ]; then
    if [ -f "$WEB_DIR/$ENV_FILE.example" ]; then
      echo -e "${YELLOW}Creating $ENV_FILE file in $VELOCITY_DIR from $ENV_FILE.example...${NC}"
      cp "$WEB_DIR/$ENV_FILE.example" "$VELOCITY_DIR/$ENV_FILE"
      echo -e "${YELLOW}Please review and update $VELOCITY_DIR/$ENV_FILE with your local configuration.${NC}"
    else
      echo -e "${RED}No $ENV_FILE or $ENV_FILE.example file found in $VELOCITY_DIR. Exiting.${NC}"
      exit 1
    fi
  fi
done

# Prompt the user to fill in the .env and .env.local files with API keys and other configurations
echo -e "${YELLOW}Please fill in the $VELOCITY_DIR/.env and $VELOCITY_DIR/.env.local files with the necessary API keys and configurations.${NC}"
echo -e "${YELLOW}For example, you might need to add entries like:${NC}"
echo -e "${YELLOW}API_KEY=your_api_key_here${NC}"
echo -e "${YELLOW}DATABASE_URL=your_database_url_here${NC}"
echo -e "${YELLOW}REDIS_URL=your_redis_url_here${NC}"
echo -e "${YELLOW}After updating the files, you can proceed with the setup.${NC}"

echo -e "${GREEN}=== Setup Complete ===${NC}"
echo -e "${YELLOW}Then, run the following commands:${NC}"
echo -e "${YELLOW}npx prisma generate${NC}"
echo -e "${YELLOW}npx prisma db push${NC}"
echo -e "${YELLOW}npm run dev${NC}"