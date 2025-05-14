module "source-intake-s3-storage" { 
    source = "../../modules/s3"
    project     = var.project
    environment = var.environment
    name = "source-intake"
    enable_versioning = true
}

module "dynamodb-s3-metadata-lookup-table" {
  source = "../modules/dynamodb"
  table_name = "s3-metadata-lookup-table"
  hash_key   = "item_id"            

  attributes = [
    { name = "item_id", type = "S" },
  ]

  global_secondary_indexes = [
    {
      name            = "item_id-index"
      hash_key        = "item_id"
      projection_type = "KEYS_ONLY"
    }
  ]

  tags = {
    Project     = "Portfolio"
    ManagedBy   = "Terraform"
  }
}