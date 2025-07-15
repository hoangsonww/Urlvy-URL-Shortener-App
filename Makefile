# Makefile for Urlvy monorepo
# Root-level commands for local dev, CI/CD, infra, container builds & deploys

# -------------------------------------------------------------------
# Variables (override via environment or command line)
# -------------------------------------------------------------------
AWS_PROFILE        ?= default
AWS_REGION         ?= us-east-1
AWS_ACCOUNT_ID     ?= 123456789012
ECR_REPO           ?= urlvy-api
ECR_TAG            ?= latest
FRONTEND_S3_BUCKET ?= urlvy-web-static
CERTIFICATE_ARN    ?= arn:aws:acm:$(AWS_REGION):$(AWS_ACCOUNT_ID):certificate/your-cert-id
DOMAIN_NAME        ?= urlvy.app
DB_PASSWORD        ?= password
VPC_ID             ?= vpc-xxxxxxxx
PRIVATE_SUBNETS    ?= subnet-aaa,subnet-bbb
PUBLIC_SUBNETS     ?= subnet-ccc,subnet-ddd
GOOGLE_API_KEY     ?= your-google-api-key

# Compose files and scripts
DOCKER_COMPOSE_FILE    := docker-compose.yml
TERRAFORM_DIR          := terraform
TERRAFORM_SCRIPT       := $(TERRAFORM_DIR)/deploy.sh
AWS_CF_SCRIPT          := aws/deploy.sh
SHELL_SETUP_SCRIPT     := shell/setup.sh
SHELL_DEPLOY_SCRIPT    := shell/deploy.sh

# Secondary variables
# Convert "subnet-aaa,subnet-bbb" → ["subnet-aaa","subnet-bbb"]
TF_PRIVATE_SUBNETS := $(shell echo $(PRIVATE_SUBNETS) | sed 's/,/","/g; s/^/["/; s/$$/"]/')
TF_PUBLIC_SUBNETS  := $(shell echo $(PUBLIC_SUBNETS)  | sed 's/,/","/g; s/^/["/; s/$$/"]/')

# Full ECR image URI
FULL_ECR_IMAGE     := $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/$(ECR_REPO):$(ECR_TAG)

# -------------------------------------------------------------------
# Phony targets
# -------------------------------------------------------------------
.PHONY: help \
        setup-dev start-dev stop-dev \
        lint lint-api lint-web \
        test test-api test-web \
        build-api build-web \
        db-migrate \
        docker-build-api docker-build-web \
        docker-push-api \
        docker-compose-up docker-compose-down \
        infra-plan infra-apply infra-destroy \
        deploy deploy-infra deploy-apps \
        clean

# -------------------------------------------------------------------
# Help
# -------------------------------------------------------------------
help:
	@echo "Usage: make <target>"
	@echo ""
	@echo "Targets:"
	@echo "  setup-dev         Clone & bootstrap local dev (backend + frontend)"
	@echo "  start-dev         Start docker-compose dev environment"
	@echo "  stop-dev          Stop docker-compose dev environment"
	@echo ""
	@echo "  lint              Run lint on both api & web"
	@echo "  lint-api          Run ESLint on api"
	@echo "  lint-web          Run ESLint on web"
	@echo ""
	@echo "  test              Run tests for both api & web"
	@echo "  test-api          Run Jest + Supertest in api"
	@echo "  test-web          Run Vitest in web"
	@echo ""
	@echo "  build-api         Compile NestJS backend"
	@echo "  build-web         Build Next.js frontend"
	@echo ""
	@echo "  db-migrate        Run TypeORM migrations"
	@echo ""
	@echo "  docker-build-api  Build backend Docker image"
	@echo "  docker-build-web  Build frontend Docker image"
	@echo "  docker-push-api   Push backend image to ECR"
	@echo ""
	@echo "  docker-compose-up   Start services via docker-compose"
	@echo "  docker-compose-down Stop services via docker-compose"
	@echo ""
	@echo "  infra-plan        Terraform plan"
	@echo "  infra-apply       Terraform apply"
	@echo "  infra-destroy     Terraform destroy"
	@echo ""
	@echo "  deploy            Full deploy: infra + apps"
	@echo "  deploy-infra      Deploy infra only"
	@echo "  deploy-apps       Build & deploy apps (docker & S3 sync)"
	@echo ""
	@echo "  clean             Remove build artifacts and temp files"

# -------------------------------------------------------------------
# Setup & Dev
# -------------------------------------------------------------------
setup-dev:
	@bash $(SHELL_SETUP_SCRIPT)

start-dev:
	@docker-compose -f $(DOCKER_COMPOSE_FILE) up -d

stop-dev:
	@docker-compose -f $(DOCKER_COMPOSE_FILE) down

# -------------------------------------------------------------------
# Linting
# -------------------------------------------------------------------
lint: lint-api lint-web

lint-api:
	@cd api && npm run lint

lint-web:
	@cd web && npm run lint

# -------------------------------------------------------------------
# Testing
# -------------------------------------------------------------------
test: test-api test-web

test-api:
	@cd api && npm run test

test-web:
	@cd web && npm run test

# -------------------------------------------------------------------
# Build
# -------------------------------------------------------------------
build-api:
	@cd api && npm run build

build-web:
	@cd web && npm run build

# -------------------------------------------------------------------
# Database
# -------------------------------------------------------------------
db-migrate:
	@cd api && npm run db:migrate

# -------------------------------------------------------------------
# Docker
# -------------------------------------------------------------------
docker-build-api:
	@echo "Building backend Docker image..."
	@cd api && docker build -t $(ECR_REPO):$(ECR_TAG) .

docker-push-api: docker-build-api
	@echo "Tagging & pushing to ECR..."
	@aws ecr get-login-password --profile $(AWS_PROFILE) --region $(AWS_REGION) \
		| docker login --username AWS --password-stdin $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com
	@docker tag $(ECR_REPO):$(ECR_TAG) $(FULL_ECR_IMAGE)
	@docker push $(FULL_ECR_IMAGE)

docker-build-web:
	@echo "Building frontend Docker image..."
	@cd web && docker build -t urlvy-web:$(ECR_TAG) .

# -------------------------------------------------------------------
# Docker Compose
# -------------------------------------------------------------------
docker-compose-up:
	@docker-compose -f $(DOCKER_COMPOSE_FILE) up -d

docker-compose-down:
	@docker-compose -f $(DOCKER_COMPOSE_FILE) down

# -------------------------------------------------------------------
# Infrastructure (Terraform)
# -------------------------------------------------------------------
infra-plan:
	@cd $(TERRAFORM_DIR) && ./deploy.sh --plan-only

infra-apply:
	@cd $(TERRAFORM_DIR) && ./deploy.sh

infra-destroy:
	@cd $(TERRAFORM_DIR) && terraform destroy -auto-approve

# -------------------------------------------------------------------
# Deployment
# -------------------------------------------------------------------
deploy: deploy-infra deploy-apps

deploy-infra:
	@echo ">>> Deploying infrastructure..."
	@./$(AWS_CF_SCRIPT)

deploy-apps: docker-push-api
	@echo ">>> Syncing frontend assets..."
	@cd web && npm run export
	@aws s3 sync out/ s3://$(FRONTEND_S3_BUCKET) --delete --profile $(AWS_PROFILE) --region $(AWS_REGION)

# -------------------------------------------------------------------
# Cleanup
# -------------------------------------------------------------------
clean:
	@echo "Cleaning build artifacts..."
	@rm -rf api/dist api/node_modules web/.next web/node_modules web/out
	@docker image prune -f
