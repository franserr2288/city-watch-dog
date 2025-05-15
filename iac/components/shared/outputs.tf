output "source_intake_s3_bucket_name" {
  value = module.source_intake_s3_storage.bucket_name
}
output "source_intake_s3_bucket_arn" {
    value = module.source_intake_s3_storage.arn
}

output "s3-metadata-lookup-table" {
  description = "The name of the DynamoDB table."
  value       = module.dynamodb-s3-metadata-lookup-table.table_name
}

output "s3-metadata-lookup-table" {
  description = "The ARN of the DynamoDB table."
  value       = module.dynamodb-s3-metadata-lookup-table.table_arn
}

output "s3-metadata-lookup-table" {
  description = "The ID of the DynamoDB table."
  value       =module.dynamodb-s3-metadata-lookup-table.id
}