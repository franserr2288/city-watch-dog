#!/usr/bin/env bash
set -euo pipefail

cd infrastructure/environments/local

tflocal init \
  -backend=false \
  -input=false

tflocal apply \
  -auto-approve \
  -input=false

echo "✅ Terraform apply complete"
