#!/bin/bash

# Setup GitHub Secrets for Firebase Deployment
# This script helps you set up GitHub Secrets automatically

set -e

echo "🔥 Firebase Hosting GitHub Actions Setup"
echo "========================================="
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

# Check if service account file exists
SERVICE_ACCOUNT_FILE=""
if [ -f "service-account.json" ]; then
    SERVICE_ACCOUNT_FILE="service-account.json"
elif [ -f "fitness-42b90-firebase-adminsdk.json" ]; then
    SERVICE_ACCOUNT_FILE="fitness-42b90-firebase-adminsdk.json"
else
    echo "⚠️  Service account JSON file not found!"
    echo ""
    echo "Please download it from Firebase Console:"
    echo "  1. Go to: https://console.firebase.google.com/project/fitness-42b90/settings/serviceaccounts/adminsdk"
    echo "  2. Click 'Generate new private key'"
    echo "  3. Save the file as 'service-account.json' in this directory"
    echo "  4. Run this script again"
    echo ""
    exit 1
fi

echo "✅ Found service account file: $SERVICE_ACCOUNT_FILE"
echo ""

# Set GitHub Secrets
echo "🔐 Setting up GitHub Secrets..."
echo ""

# Set FIREBASE_SERVICE_ACCOUNT
echo "  Setting FIREBASE_SERVICE_ACCOUNT..."
gh secret set FIREBASE_SERVICE_ACCOUNT -R "$REPO" < "$SERVICE_ACCOUNT_FILE"

# Set FIREBASE_PROJECT_ID
echo "  Setting FIREBASE_PROJECT_ID..."
echo "$PROJECT_ID" | gh secret set FIREBASE_PROJECT_ID -R "$REPO"

echo ""
echo "✅ GitHub Secrets have been set successfully!"
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
