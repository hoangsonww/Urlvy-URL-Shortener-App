#!/usr/bin/env bash
# Initialize and apply Terraform configuration for Urlvy infra

set -euo pipefail

# === Configuration ===
: "${AWS_PROFILE:=default}"
: "${AWS_REGION:=us-east-1}"
: "${CERTIFICATE_ARN:?ARN of ACM cert for CloudFront}"
: "${DB_PASSWORD:?Postgres admin password}"
: "${VPC_ID:?Your VPC ID}"
: "${PRIVATE_SUBNETS:?Comma-separated list of private subnet IDs}"
: "${PUBLIC_SUBNETS:?Comma-separated list of public subnet IDs}"
: "${ECS_CONTAINER_IMAGE:?ECR URI of your urlvy-api image}"
: "${GOOGLE_API_KEY:?Your Google Gemini API key}"

# Convert comma lists to Terraform list syntax
TF_PRIVATE_SUBNETS=$(printf '["%s"]' "${PRIVATE_SUBNETS//,/\",\"}")
TF_PUBLIC_SUBNETS=$(printf '["%s"]' "${PUBLIC_SUBNETS//,/\",\"}")

# Export variables for Terraform
export TF_VAR_aws_profile="$AWS_PROFILE"
export TF_VAR_aws_region="$AWS_REGION"
export TF_VAR_certificate_arn="$CERTIFICATE_ARN"
export TF_VAR_db_password="$DB_PASSWORD"
export TF_VAR_vpc_id="$VPC_ID"
export TF_VAR_private_subnets="$TF_PRIVATE_SUBNETS"
export TF_VAR_public_subnets="$TF_PUBLIC_SUBNETS"
export TF_VAR_ecs_container_image="$ECS_CONTAINER_IMAGE"
export TF_VAR_google_api_key="$GOOGLE_API_KEY"

# === Deploy ===
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
cd "$SCRIPT_DIR"

echo "Initializing Terraform…"
terraform init

echo "Planning Terraform changes…"
terraform plan -out tfplan

echo "Applying Terraform changes…"
terraform apply -auto-approve tfplan

echo "Done! 🚀"
