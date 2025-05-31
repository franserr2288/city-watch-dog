resource "aws_dynamodb_table" "this" {
  name             = var.table_name
  billing_mode     = "PAY_PER_REQUEST"
  hash_key         = var.hash_key
  range_key        = var.range_key


  attribute {
    name = var.hash_key
    type = [for attr in var.attributes : attr.type if attr.name == var.hash_key][0]
  }

  dynamic "attribute" {
    for_each = var.range_key != null ? [1] : []
    content {
      name = var.range_key
      type = [for attr in var.attributes : attr.type if attr.name == var.range_key][0]
    }
  }

  dynamic "attribute" {
      for_each = [
        for attr in var.attributes : attr
        if attr.name != var.hash_key && (var.range_key == null || attr.name != var.range_key)
      ]
      content {
          name = attribute.value.name
          type = attribute.value.type
      }
  }

  # Global Secondary Indexes
  dynamic "global_secondary_index" {
    for_each = var.global_secondary_indexes
    content {
      name              = global_secondary_index.value.name
      hash_key          = global_secondary_index.value.hash_key
      range_key         = lookup(global_secondary_index.value, "range_key", null) 
      projection_type   = global_secondary_index.value.projection_type
      non_key_attributes = lookup(global_secondary_index.value, "non_key_attributes", null) 
    }
  }

  point_in_time_recovery {
    enabled = true
  }

  server_side_encryption {
    enabled = true
    # kms_key_arn is not specified, so AWS managed key is used
  }

  deletion_protection_enabled = true
  tags = var.tags
}


