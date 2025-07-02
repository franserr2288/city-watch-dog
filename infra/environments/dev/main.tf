module "shared" {
  source      = "../../components/shared"
  project     = var.project
  environment = var.environment
}

# module "source_intake" {
#   source       = "../../components/source-intake"
#   project      = var.project
#   environment  = var.environment
#   intake_bucket_arn   = module.shared.source_intake_s3_bucket_arn
#   metadata_table_arn = module.shared.dynamodb_s3_metadata_lookup_table_arn
# }