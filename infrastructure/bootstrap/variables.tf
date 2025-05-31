variable "bootstrap-region" { 
    type = string
    description = "Location of s3 bucket and dynmodb table for remote state"
}
variable "project" {
  type        = string
  description = "Project or system name (e.g. los-angeles)"
}

variable "environment" {
  type        = string
  description = "Environment name (e.g. dev, prod)"
}