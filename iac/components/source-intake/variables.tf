variable "bucket_name" {
  type        = string
  description = "Name of the shared intake S3 bucket"
}

variable "intake_bucket_arn" {
  type        = string
  description = "ARN of the shared intake S3 bucket"
}

variable "metadata_table_arn" {
  type        = string
  description = "ARN of the Dynamodb table for metadata"
}
variable "metadata_table_name" {
  type        = string
  description = "Table name of the Dynamodb table for metadata"
}


variable "project" {
  type        = string
  description = "Project or system name (e.g. los-angeles)"
}

variable "environment" {
  type        = string
  description = "Environment name (e.g. dev, prod)"
}