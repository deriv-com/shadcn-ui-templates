#!/bin/bash

echo "🧪 Testing CLI build locally..."

# Navigate to CLI directory
cd cli

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building CLI..."
npm run build

echo "✅ Build test complete!"
