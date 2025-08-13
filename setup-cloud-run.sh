#!/bin/bash

# Setup script for Cloud Run deployment
# Run this once to configure the GCP project

PROJECT_ID="silent-text-458716-c9"
SERVICE_NAME="esferazap"
REGION="us-central1"

echo "🚀 Setting up Cloud Run for EsferaZap..."

# Set the project
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "📡 Enabling required APIs..."
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  containerregistry.googleapis.com \
  secretmanager.googleapis.com

# Create secrets for Firebase
echo "🔐 Creating secrets for Firebase credentials..."
echo "Please paste your Firebase private key (from service account JSON):"
read -r FIREBASE_KEY
echo $FIREBASE_KEY | gcloud secrets create firebase-private-key --data-file=-

echo "Please paste your Firebase client email:"
read -r FIREBASE_EMAIL
echo $FIREBASE_EMAIL | gcloud secrets create firebase-client-email --data-file=-

# Create Cloud Build trigger
echo "🔧 Creating Cloud Build trigger..."
gcloud builds triggers create github \
  --repo-name=EsferaZap \
  --repo-owner=Ericobon \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml \
  --name="esferazap-deploy" \
  --description="Deploy EsferaZap to Cloud Run on push to main"

# Create initial Cloud Run service
echo "☁️ Creating Cloud Run service..."
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10

echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Add GCP_SA_KEY secret to GitHub repository settings"
echo "2. Push to main branch to trigger deployment"
echo "3. Access your app at the Cloud Run URL"
echo ""
echo "🔗 Cloud Run URL:"
gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)'