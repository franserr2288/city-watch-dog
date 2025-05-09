resource "random_id" "bucket_suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "intake_bucket" {
  bucket = "${local.prefix}-source-intake-${random_id.bucket_suffix.hex}"
}

output "intake_bucket_name" {
  value = aws_s3_bucket.intake_bucket.id
}

output "intake_bucket_arn" {
  value = aws_s3_bucket.intake_bucket.arn
}
