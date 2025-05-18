module "source_intake_s3_storage" { 
    source = "../../modules/s3"
    project     = var.project
    environment = var.environment
    name = "source-intake"
    enable_versioning = true
}

module "dynamodb_s3_metadata_lookup_table" {
  source = "../../modules/dynamodb"
  table_name = "s3-metadata-lookup-table"
  hash_key   = "item_id"     
  range_key = "creation_date"       

  attributes = [
    { name = "item_id", type = "S" },
    {name = "creation_date", type = "S"}
  ]

  global_secondary_indexes = []

  tags = {
    Project     = "Portfolio"
    ManagedBy   = "Terraform"
  }
}


