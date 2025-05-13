module "s3-remote-state" {
    source = "../modules/s3"
    project     = var.project
    environment = var.environment
    name = "terraform-remote-state"
    enable_versioning = true
}

module "dynamodb-state-lock-table" {
  source = "../modules/dynamodb"
  table_name = "terraform-remote-state-lock"
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


