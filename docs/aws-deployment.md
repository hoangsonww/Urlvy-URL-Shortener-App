# ☁️ Urlvy AWS Deployment Guide

This guide walks you through provisioning your **Urlvy** infrastructure on AWS using CloudFormation templates located in `aws/`, and shows how to deploy them with the provided scripts.

---

## 📁 Project Layout

```
.
├── aws/
│   ├── deploy.sh
│   ├── ecs-backend.yml
│   ├── rds-postgresql.yml
│   └── s3-cloudfront.yml
├── docs/
│   └── ...
├── kubernetes/
│   ├── api-deployment.yaml
│   ├── api-service.yaml
│   ├── configmap.yaml
│   ├── ingress.yaml
│   ├── namespace.yaml
│   ├── secret.yaml
│   ├── web-deployment.yaml
│   └── web-service.yaml
├── shell/
│   ├── deploy.sh
│   └── setup.sh
└── terraform/
├── deploy.sh
├── provider.tf
├── variables.tf
├── ecs.tf
├── rds.tf
├── s3\_cloudfront.tf
└── outputs.tf

```

---

## 🔧 1. CloudFormation Stacks (aws/)

We manage three core stacks via plain‑YAML CloudFormation:

| Template               | Purpose                                                              |
| ---------------------- | -------------------------------------------------------------------- |
| **rds-postgresql.yml** | Create a VPC, subnet group & a managed PostgreSQL instance           |
| **ecs-backend.yml**    | Push your Docker image to ECR, define an ECS cluster, task & service |
| **s3-cloudfront.yml**  | Host static assets in S3 & serve them via CloudFront with HTTPS      |

### 1.1 `aws/deploy.sh`

A wrapper that deploys all three stacks in the correct order:

```bash
#!/usr/bin/env bash
set -euo pipefail

# Usage: ./deploy.sh [image-tag]
AWS_REGION="${AWS_REGION:-us-east-1}"
STACK_PREFIX="urlvy"
IMAGE_TAG="${1:-latest}"

# Ensure required env vars
: "${DB_PASSWORD:?Need to set DB_PASSWORD}"
: "${SUPABASE_URL:?Need to set SUPABASE_URL}"
: "${SUPABASE_ANON_KEY:?Need to set SUPABASE_ANON_KEY}"

echo "👉 Deploying RDS stack..."
aws cloudformation deploy \
  --template-file rds-postgresql.yml \
  --stack-name ${STACK_PREFIX}-rds \
  --region ${AWS_REGION} \
  --parameter-overrides \
      DBPassword=${DB_PASSWORD} \
  --capabilities CAPABILITY_NAMED_IAM

echo "👉 Deploying ECS backend stack..."
aws cloudformation deploy \
  --template-file ecs-backend.yml \
  --stack-name ${STACK_PREFIX}-ecs \
  --region ${AWS_REGION} \
  --parameter-overrides \
      ImageTag=${IMAGE_TAG} \
      SupabaseUrl=${SUPABASE_URL} \
      SupabaseAnonKey=${SUPABASE_ANON_KEY} \
  --capabilities CAPABILITY_NAMED_IAM

echo "👉 Deploying S3 & CloudFront stack..."
aws cloudformation deploy \
  --template-file s3-cloudfront.yml \
  --stack-name ${STACK_PREFIX}-cdn \
  --region ${AWS_REGION} \
  --parameter-overrides \
      SupabaseUrl=${SUPABASE_URL} \
      SupabaseAnonKey=${SUPABASE_ANON_KEY} \
  --capabilities CAPABILITY_NAMED_IAM

echo "✅ All stacks deployed successfully!"
```

Make executable:

```bash
chmod +x aws/deploy.sh
```

---

## 📄 2. Template Overviews

### 2.1 `rds-postgresql.yml`

- **VPC**, **SubnetGroup**, **Security Group**
- **AWS::RDS::DBInstance** (PostgreSQL 15)
- Outputs: `DBEndpoint`, `DBPort`

### 2.2 `ecs-backend.yml`

- **ECR Repository** for your NestJS API image
- **IAM Roles** for ECS task execution
- **ECS Cluster**, **TaskDefinition**, **Service** (Fargate)
- **Application Load Balancer** + **TargetGroup**
- Outputs: `ApiUrl`

### 2.3 `s3-cloudfront.yml`

- **S3 Bucket** to host Next.js static assets
- **BucketPolicy** for public read
- **CloudFront Distribution** with OAI/HTTPS
- Outputs: `WebUrl`

---

## ▶️ 3. Deploy Steps

1. **Set environment variables** (or create `aws/.env`):

   ```bash
   export AWS_REGION="us-east-1"
   export DB_PASSWORD="YourStrongDBPass"
   export SUPABASE_URL="https://xyz.supabase.co"
   export SUPABASE_ANON_KEY="your-anon-key"
   ```

2. **Run the deploy script**:

   ```bash
   cd aws
   ./deploy.sh latest
   ```

3. **Grab outputs** via AWS Console or CLI:

   ```bash
   aws cloudformation describe-stacks \
     --stack-name urlvy-rds \
     --query "Stacks[0].Outputs"
   ```

---

## ⚙️ 4. Alternative: Terraform (terraform/)

If you prefer Terraform, a parallel setup lives under `terraform/`, with identical responsibilities:

- `provider.tf` → AWS provider
- `variables.tf` → region, env, credentials, image tag
- `rds.tf` → RDS module
- `ecs.tf` → ECR + ECS + ALB
- `s3_cloudfront.tf` → S3 + CloudFront
- `outputs.tf` → endpoint URLs

Use its own `terraform/deploy.sh`:

```bash
cd terraform
./deploy.sh production latest
```

---

## 🚀 5. Next Steps

- ▶️ **Kubernetes**: use `kubernetes/` manifests to deploy on EKS or any K8s cluster
- ▶️ **Shell scripts**: `shell/setup.sh` bootstraps local dev, `shell/deploy.sh` wraps the AWS flows
- ▶️ **CI/CD**: integrate `aws/deploy.sh` or `terraform/deploy.sh` into GitHub Actions for push‑to‑deploy

---

**Congratulations!**
Your Urlvy backend, database, and static‑site CDN are now live on AWS.
Point your DNS at the API load balancer and CloudFront domain, and you’re ready to share your first short link! 🚀
