variable "project" {
  description = "The project or system name (e.g. los-angeles)"
  type        = string
}

variable "environment" {
  description = "Environment name (e.g. dev, prod)"
  type        = string
}

variable "name" {
  description = "The logical name of the bucket (e.g. intake, logs)"
  type        = string
}