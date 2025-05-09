variable "project" {
  description = "The project or system name (e.g. los-angeles)"
  type        = string
}

variable "environment" {
  description = "Environment name (e.g. dev, prod)"
  type        = string
}

locals {
  prefix = "${var.project}-${var.environment}"
}
