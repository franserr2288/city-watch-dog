output "source_intake_s3_bucket_arn" {
  value = module.source_intake_s3_storage.bucket_arn
}

output "dynamodb_s3_metadata_lookup_table_arn" {
  description = "The ARN of the DynamoDB table."
  value       = module.dynamodb_s3_metadata_lookup_table.dynamodb_table_arn
}
