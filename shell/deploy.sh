#!/usr/bin/env bash
# Build & publish Urlvy services, then deploy infra + static assets

set -euo pipefail

# === CONFIGURATION (export or edit here) ===
: "${AWS_PROFILE:=default}"
: "${AWS_REGION:=us-east-1}"
: "${AWS_ACCOUNT_ID:?AWS account ID}"
: "${ECR_REPO:=urlvy-api}"
: "${ECR_TAG:=latest}"
: "${FRONTEND_S3_BUCKET:=urlvy-web-static}"
: "${CERTIFICATE_ARN:?ACM cert ARN for CloudFront}"
: "${DOMAIN_NAME:=urlvy.app}"

# === 1) Build & push backend Docker image ===
echo "🔨 Building backend Docker image…"
cd urlvy/api
docker build -t "$ECR_REPO:$ECR_TAG" .

echo "🔐 Logging into ECR…"
aws ecr get-login-password \
  --profile "$AWS_PROFILE" \
  --region "$AWS_REGION" | docker login \
    --username AWS \
    --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

FULL_IMAGE="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$ECR_TAG"
docker tag "$ECR_REPO:$ECR_TAG" "$FULL_IMAGE"
docker push "$FULL_IMAGE"
echo "✅ Pushed $FULL_IMAGE"

# === 2) Build & sync frontend assets ===
echo "🌐 Building and exporting frontend…"
cd ../web
npm ci
npm run build
npm run export         # outputs to ./out by default

echo "☁️  Syncing to S3 bucket s3://$FRONTEND_S3_BUCKET…"
aws s3 sync out/ "s3://$FRONTEND_S3_BUCKET" \
  --delete --profile "$AWS_PROFILE" --region "$AWS_REGION"
echo "✅ Frontend assets synced"

# === 3) Deploy infra ===
echo "📦 Deploying infrastructure…"
# terraform/deploy.sh should be executable
cd ../../terraform
./deploy.sh

# aws/deploy.sh for CloudFormation (if you prefer CF over Terraform)
# cd ../aws
# ./deploy.sh

echo "🚀 Deployment complete!"
