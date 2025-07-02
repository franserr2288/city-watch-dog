variable "table_name" {
  description = "The name of the DynamoDB table."
  type        = string
}

variable "hash_key" {
  description = "The name of the hash key (partition key) for the table."
  type        = string
}


variable "attributes" {
  description = "A list of attribute definitions for the table. This *must* include the hash key, range key (if used), and any attributes used in GSIs."
  type = list(object({
    name = string
    type = string # S (string), N (number), or B (binary)
  }))
}

# ----------------  OPTIONAL ---------------- 
variable "range_key" {
  description = "The name of the range key (sort key) for the table."
  type        = string
  default     = null
}


variable "global_secondary_indexes" {
  description = "A list of Global Secondary Indexes (GSIs) for the table. Use this to query on attributes other than the primary key."
  type = list(object({
    name          = string
    hash_key      = string
    range_key     = string # Optional GSI sort key
    projection_type = string # ALL, KEYS_ONLY, or INCLUDE
    non_key_attributes = list(string) # Required if projection_type is INCLUDE. Optional otherwise.
    # Capacity units are managed automatically by PAY_PER_REQUEST, so they are not included here.
  }))
  default = []
}

variable "tags" {
  description = "A map of tags to assign to the table."
  type        = map(string)
  default     = {}
}
