variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "aws_profile" {
  type    = string
  default = "default"
}

variable "domain_name" {
  type    = string
  default = "urlvy.app"
}

variable "certificate_arn" {
  type = string
  description = "ACM certificate ARN for your CloudFront distribution"
}

variable "db_username" {
  type    = string
  default = "admin"
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "vpc_id" {
  type = string
}

variable "private_subnets" {
  type = list(string)
}

variable "public_subnets" {
  type = list(string)
}

variable "ecs_container_image" {
  type        = string
  description = "ECR image URI for your urlvy-api"
}

variable "ecs_desired_count" {
  type    = number
  default = 2
}

variable "monthly_budget_limit" {
  type        = number
  default     = 50
  description = "Monthly AWS cost budget limit in USD. An alert is sent at 80% of this value."
}

variable "budget_alert_email" {
  type        = string
  description = "Email address to receive AWS budget alert notifications."

  validation {
    condition     = can(regex("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", var.budget_alert_email))
    error_message = "The budget_alert_email value must be a valid email address."
  }
}
