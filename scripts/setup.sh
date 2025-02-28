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

# 1. Install dependencies in the monorepo root
echo "Installing root dependencies..."
npm install

# 2. Install dependencies in the web app directory
if [ -d "apps/velocity" ]; then
  echo "Installing dependencies in apps/web..."
  cd apps/velocity
  npm install
  cd ../..
else
  echo "Directory apps/velocity not found. Please check your repository structure."
  exit 1
fi

# 3. Configure environment variables
# Check if a .env file exists in apps/web; if not, copy from .env.example
if [ ! -f "apps/web/.env" ]; then
  if [ -f "apps/web/.env.example" ]; then
    echo "Creating .env file in apps/velocity from .env.example..."
    cp apps/web/.env.example apps/velocity/.env
    echo "Please review and update apps/velocity/.env with your local configuration."
  else
    echo "No .env or .env.example file found in apps/velocity. Exiting."
    exit 1
  fi
fi
if [ ! -f "apps/web/.env.local" ]; then
  if [ -f "apps/web/.env.local.example" ]; then
    echo "Creating .env file in apps/velocity from .env.local.example..."
    cp apps/web/.env.example apps/velocity/.env.local
    echo "Please review and update apps/velocity/.env.local with your local configuration."
  else
    echo "No .env.local or .env.local.example file found in apps/velocity. Exiting."
    exit 1
  fi
fi

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
