locals {
  prefix = "${var.project}-${var.environment}"
  bucket_name = "${local.prefix}-${var.name}-${random_id.bucket_suffix.hex}"
}
