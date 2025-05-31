
variable "role_name" {
  description = "Name for the IAM role"
  type        = string
}
variable "dynamodb_table_access" {
  description = "List of DynamoDB tables this role needs access to"
  type        = list(string)
  default     = []
}

variable "dynamodb_read_only" {
  description = "Whether DynamoDB access should be read-only"
  type        = bool
  default     = false
}

variable "s3_bucket_access" {
  description = "List of S3 buckets this role needs access to"
  type        = list(string)
  default     = []
}

variable "s3_read_only" {
  description = "Whether S3 access should be read-only"
  type        = bool
  default     = false
}
