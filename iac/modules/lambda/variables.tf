variable "name" {
  type        = string
  description = "Base name for Lambda (also used for the IAM role and function name)."
}

variable "filename" {
  type        = string
  description = "Path to the zip file for the Lambda code (relative to Terraform working dir)."
}

variable "handler" {
  type        = string
  description = "Handler entrypoint, e.g. index.handler"
}
variable "role_arn" {
  type        = string
  description = "IAM role arn"
}

# ----------------  OPTIONAL ---------------- 
variable "runtime" {
  type        = string
  default     = "nodejs18.x"
  description = "Lambda runtime identifier."
}

variable "memory_size" {
  type        = number
  default     = 528
  description = "MB of memory for the function."
}
variable "timeout" {
  type        = number
  default     = 10
  description = "Maximum execution time (seconds)."
}

variable "environment" {
  type        = map(string)
  default     = {}
  description = "Environment variables to pass into the Lambda."
}
