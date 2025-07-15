#!/usr/bin/env bash
# Deploy Urlvy CloudFormation stacks: S3 + CloudFront, RDS, ECS API

set -euo pipefail

# === Configuration ===
AWS_PROFILE=${AWS_PROFILE:-default}
AWS_REGION=${AWS_REGION:-us-east-1}

# S3 + CloudFront
CF_WEB_STACK="urlvy-web"
TEMPLATE_WEB="aws/s3-cloudfront.yml"
PARAMS_WEB=(
  --parameter-overrides \
    SiteBucketName=urlvy-web-static \
    DomainName=urlvy.app \
    CertificateArn=arn:aws:acm:${AWS_REGION}:123456789012:certificate/your-cert-id
)

# RDS PostgreSQL
CF_DB_STACK="urlvy-db"
TEMPLATE_DB="aws/rds-postgresql.yml"
PARAMS_DB=(
  --parameter-overrides \
    DBInstanceIdentifier=urlvy-db \
    DBUsername=admin \
    DBPassword=REPLACE_WITH_SECRET \
    DBAllocatedStorage=20 \
    DBInstanceClass=db.t3.medium \
    VpcId=vpc-xxxxxxxx \
    SubnetIds=\"subnet-aaa,subnet-bbb\"
)

# ECS Backend
CF_API_STACK="urlvy-api"
TEMPLATE_API="aws/ecs-backend.yml"
PARAMS_API=(
  --parameter-overrides \
    ClusterName=urlvy-cluster \
    ServiceName=urlvy-api \
    ContainerImage=123456789012.dkr.ecr.${AWS_REGION}.amazonaws.com/urlvy-api:latest \
    DesiredCount=2 \
    DBEndpoint=urlvy-db.${AWS_REGION}.rds.amazonaws.com:5432 \
    DBUsername=admin \
    DBPassword=REPLACE_WITH_SECRET \
    VpcId=vpc-xxxxxxxx \
    SubnetIds=\"subnet-aaa,subnet-bbb\" \
    SecurityGroupIds=\"sg-aaa,sg-bbb\"
)

# Create output dir
OUT_DIR="aws/out"
mkdir -p "${OUT_DIR}"

# Helper to package & deploy
deploy_stack() {
  local stack=$1
  local template=$2
  shift 2
  local params=("$@")

  local packaged="${OUT_DIR}/$(basename ${template%.*})-packaged.yml"

  echo "Packaging ${template} → ${packaged}"
  aws cloudformation package \
    --profile "${AWS_PROFILE}" \
    --region "${AWS_REGION}" \
    --template-file "${template}" \
    --s3-bucket CF-BUCKET-NAME \
    --output-template-file "${packaged}"

  echo "Deploying stack ${stack}"
  aws cloudformation deploy \
    --profile "${AWS_PROFILE}" \
    --region "${AWS_REGION}" \
    --stack-name "${stack}" \
    --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
    --template-file "${packaged}" \
    "${params[@]}"
}

# === Main ===
echo "Starting deployment in region ${AWS_REGION} (profile: ${AWS_PROFILE})"

deploy_stack "${CF_WEB_STACK}" "${TEMPLATE_WEB}" "${PARAMS_WEB[@]}"
deploy_stack "${CF_DB_STACK}"  "${TEMPLATE_DB}"  "${PARAMS_DB[@]}"
deploy_stack "${CF_API_STACK}" "${TEMPLATE_API}" "${PARAMS_API[@]}"

echo "All stacks deployed successfully."
