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

echo "=== Starting velociType Setup ==="

# Define directories
ROOT_DIR=$(pwd)
VELOCITY_DIR="apps/velocity"
WEB_DIR="apps/web"

# 1. Install dependencies in the monorepo root
echo "Installing root dependencies..."
npm install

# 2. Install dependencies in the web app directory
if [ -d "$VELOCITY_DIR" ]; then
  echo "Installing dependencies in $VELOCITY_DIR..."
  cd $VELOCITY_DIR
  npm install
  cd $ROOT_DIR
else
  echo "Directory $VELOCITY_DIR not found. Please check your repository structure."
  exit 1
fi

# 3. Configure environment variables
# Check if a .env file exists in $WEB_DIR; if not, copy from .env.example
for ENV_FILE in ".env" ".env.local"; do
  if [ ! -f "$WEB_DIR/$ENV_FILE" ]; then
    if [ -f "$WEB_DIR/$ENV_FILE.example" ]; then
      echo "Creating $ENV_FILE file in $VELOCITY_DIR from $ENV_FILE.example..."
      cp "$WEB_DIR/$ENV_FILE.example" "$VELOCITY_DIR/$ENV_FILE"
      echo "Please review and update $VELOCITY_DIR/$ENV_FILE with your local configuration."
    else
      echo "No $ENV_FILE or $ENV_FILE.example file found in $VELOCITY_DIR. Exiting."
      exit 1
    fi
  fi
done

# 4. Set up the database
echo "Generating Prisma client..."
npx prisma generate

echo "Pushing Prisma schema to the database..."
npx prisma db push

# Optional: Seed the database if a seed script is available.
if [ -f "prisma/seed.js" ] || [ -f "prisma/seed.ts" ]; then
  echo "Seeding the database..."
  npx prisma db seed
else
  echo "No seed script found. Skipping seeding."
fi

# 5. Start the development server using TurboRepo
echo "Starting the development server..."
npx turbo dev

# =======================================================
# Setup complete!
# Access the site at http://localhost:3000
# =======================================================
