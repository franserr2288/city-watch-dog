resource "aws_sns_topic" "this" {
  name              = var.name
  kms_master_key_id = "alias/aws/sns"
  
  tags = merge(var.tags, {
    Name = var.name
  })
}