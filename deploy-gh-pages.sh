#!/bin/bash

echo "🚀 Deploying to GitHub Pages..."

# Build the project
echo "📦 Building project..."
npm run build

# Switch to gh-pages branch
echo "🔄 Switching to gh-pages branch..."
git checkout gh-pages

# Remove all files except .git
echo "🧹 Cleaning gh-pages branch..."
git rm -rf . --ignore-unmatch
rm -rf .vite node_modules

# Copy dist contents to root
echo "📋 Copying build files..."
cp -r dist/* .

# Add all files
echo "📝 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy: Update GitHub Pages with latest build"

# Push to gh-pages
echo "🚀 Pushing to GitHub Pages..."
git push origin gh-pages

# Switch back to master
echo "🔄 Switching back to master..."
git checkout master

echo "✅ Deployment complete!"
echo "🌐 Visit: https://deriv-com.github.io/shadcn-ui-templates/"
