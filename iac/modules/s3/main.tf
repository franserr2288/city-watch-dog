resource "random_id" "bucket_suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "bucket" {
  bucket = "${local.prefix}-${var.name}-${random_id.bucket_suffix.hex}"
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
  tags = {
    Project     = var.projects
    Environment = var.environment
    Name        = "${local.prefix}-${var.name}"
  }

}