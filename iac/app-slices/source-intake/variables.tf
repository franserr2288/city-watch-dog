variable "bucket_name" {
  type        = string
  description = "Name of the shared intake S3 bucket"
}

variable "bucket_arn" {
  type        = string
  description = "ARN of the shared intake S3 bucket"
}

variable "project" {
  type        = string
  description = "Project or system name (e.g. los-angeles)"
}

variable "environment" {
  type        = string
  description = "Environment name (e.g. dev, prod)"
}