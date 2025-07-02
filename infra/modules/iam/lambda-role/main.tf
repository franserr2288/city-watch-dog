
resource "aws_iam_role" "lambda_role" {
  name = var.role_name
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy" "lambda_logs" {
  name = "${var.role_name}-logs"
  role = aws_iam_role.lambda_role.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ]
      Resource = "arn:aws:logs:*:*:*"
    }]
  })
}

resource "aws_iam_role_policy" "dynamodb_access" {
  count = length(var.dynamodb_table_access) > 0 ? 1 : 0
  
  name = "${var.role_name}-dynamodb"
  role = aws_iam_role.lambda_role.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = var.dynamodb_read_only ? [
        "dynamodb:GetItem",
        "dynamodb:Scan",
        "dynamodb:Query",
        "dynamodb:BatchGetItem"
      ] : [
        "dynamodb:GetItem",
        "dynamodb:Scan", 
        "dynamodb:Query",
        "dynamodb:BatchGetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:BatchWriteItem"
      ]
      Resource = [for table in var.dynamodb_table_access : "arn:aws:dynamodb:*:*:table/${table}"]
    }]
  })
}

resource "aws_iam_role_policy" "s3_access" {
  count = length(var.s3_bucket_access) > 0 ? 1 : 0
  
  name = "${var.role_name}-s3"
  role = aws_iam_role.lambda_role.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = var.s3_read_only ? [
        "s3:GetObject",
        "s3:ListBucket"
      ] : [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ]
      Resource = flatten([
        for bucket in var.s3_bucket_access : [
          "arn:aws:s3:::${bucket}",
          "arn:aws:s3:::${bucket}/*"
        ]
      ])
    }]
  })
}

