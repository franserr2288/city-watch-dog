resource "aws_lambda_function" "this" {
  function_name = var.name
  filename      = var.filename
  handler       = var.handler
  runtime       = var.runtime
  role          = var.role_arn

  memory_size = var.memory_size
  timeout     = var.timeout

  environment {
    variables = var.environment
  }

  # keep Terraform from re-uploading unchanged code
  source_code_hash = filebase64sha256(var.filename)
}
