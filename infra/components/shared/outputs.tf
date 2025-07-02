output "source_intake_s3_bucket_arn" {
  value = module.source_intake_s3_storage.bucket_arn
}
output "source_intake_s3_bucket_name" {
  value = module.source_intake_s3_storage.bucket_id
}

output "dynamodb_s3_metadata_lookup_table_arn" {
  description = "The ARN of the DynamoDB table."
  value       = module.dynamodb_s3_metadata_lookup_table.dynamodb_table_arn
}

output "config_table_name" {
  value       = module.dynamodb_config_table.dynamodb_table_name
}


output "intake_table_name" {
  value       = module.city_311_data.dynamodb_table_name
}