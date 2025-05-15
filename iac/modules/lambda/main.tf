# establish trust 
data "aws_iam_policy_document" "assume" {
  statement {
    actions   = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

# role and policy attachments
resource "aws_iam_role" "this" {
  name               = var.name
  assume_role_policy = data.aws_iam_policy_document.assume.json
}

resource "aws_iam_role_policy_attachment" "basic" {
  role       = aws_iam_role.this.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "extras" {
  for_each   = toset(var.policy_arns)
  role       = aws_iam_role.this.name
  policy_arn = each.key
}
resource "aws_iam_role_policy" "inline" {
  count = length(var.inline_statements) > 0 ? 1 : 0

  name = "${var.name}-inline-policy"
  role = aws_iam_role.this.id

  policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [
      for stmt in var.inline_statements : {
        Sid       = stmt.sid
        Effect    = "Allow"
        Action    = stmt.actions
        Resource  = stmt.resources
      }
    ]
  })
}

resource "aws_lambda_function" "this" {
  function_name = var.name
  filename      = var.filename
  handler       = var.handler
  runtime       = var.runtime
  role          = aws_iam_role.this.arn

  memory_size = var.memory_size
  timeout     = var.timeout

  environment {
    variables = var.environment
  }

  # keep Terraform from re-uploading unchanged code
  source_code_hash = filebase64sha256(var.filename)
}
