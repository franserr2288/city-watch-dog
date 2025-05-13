module "shared" {
  source      = "../../components/shared"
  project     = var.project
  environment = var.environment
}

module "source_intake" {
  source       = "../../components/source-intake"
  project      = var.project
  environment  = var.environment
  bucket_name  = module.shared.intake_bucket_name
  bucket_arn   = module.shared.intake_bucket_arn
}
