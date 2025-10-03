#!/bin/bash

echo "Rebuilding CLI..."

# Navigate to CLI directory
cd cli

# Remove old dist directory
echo "Removing old dist directory..."
rm -rf dist

# Install dependencies with correct chalk version
echo "Installing dependencies..."
npm install

# Build the CLI
echo "Building CLI..."
npx tsc

# Copy components
echo "Copying components..."
node scripts/copy-components.js

echo "CLI rebuild complete!"
echo "Testing CLI..."
node dist/index.js -v
