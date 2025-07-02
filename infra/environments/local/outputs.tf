output "daily_snapshot_bucket" {
    value = module.shared.source_intake_s3_bucket_name
}

output "config_table" {
    value = module.shared.config_table_name
}

output "intake_table" {
    value = module.shared.intake_table_name
}

# output "infra_region" {
#     value = var.region
# }