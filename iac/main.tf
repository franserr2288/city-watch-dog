module "shared" {
  source      = "./shared"
  project     = "los-angeles"
  environment = "dev"
}

module "source_intake" {
  source       = "./source-intake"
  project      = "los-angeles"
  environment  = "dev"
  bucket_name  = module.shared.intake_bucket_name
  bucket_arn   = module.shared.intake_bucket_arn
}
