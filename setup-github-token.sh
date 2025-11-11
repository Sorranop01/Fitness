#!/bin/bash

# Setup GitHub Secrets with Firebase Token
# This is an alternative method when Service Account key creation is restricted

set -e

echo "🔥 Firebase Hosting GitHub Actions Setup (Token Method)"
echo "========================================================="
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo ""
    echo "Please install it first:"
    echo "  macOS: brew install gh"
    echo "  Other: https://cli.github.com/"
    echo ""
    exit 1
fi

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed."
    echo ""
    echo "Please install it first:"
    echo "  pnpm install -g firebase-tools"
    echo ""
    exit 1
fi

# Check if user is logged in to GitHub CLI
if ! gh auth status &> /dev/null; then
    echo "🔐 Please login to GitHub CLI first..."
    gh auth login
fi

echo "✅ GitHub CLI is ready"
echo ""

# Get repository info
REPO="Sorranop01/Fitness"
PROJECT_ID="fitness-42b90"

echo "📦 Repository: $REPO"
echo "🔥 Firebase Project: $PROJECT_ID"
echo ""

# Generate Firebase CI token
echo "🔑 Generating Firebase CI token..."
echo ""
echo "⚠️  You will be redirected to your browser to authorize Firebase CLI"
echo "   Please complete the login process..."
echo ""

# Generate token
FIREBASE_TOKEN=$(firebase login:ci --no-localhost)

if [ -z "$FIREBASE_TOKEN" ]; then
    echo "❌ Failed to generate Firebase token"
    echo ""
    echo "Please try again or generate manually:"
    echo "  firebase login:ci"
    echo ""
    exit 1
fi

echo ""
echo "✅ Firebase token generated successfully!"
echo ""

# Set GitHub Secret
echo "🔐 Setting up GitHub Secret..."
echo ""

echo "$FIREBASE_TOKEN" | gh secret set FIREBASE_TOKEN -R "$REPO"

echo ""
echo "✅ GitHub Secret has been set successfully!"
echo ""
echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "  1. Commit and push your changes:"
echo "     git add ."
echo "     git commit -m 'Setup CI/CD with GitHub Actions'"
echo "     git push origin main"
echo ""
echo "  2. Check GitHub Actions:"
echo "     https://github.com/$REPO/actions"
echo ""
echo "  3. Your site will be deployed to:"
echo "     https://$PROJECT_ID.web.app"
echo ""
