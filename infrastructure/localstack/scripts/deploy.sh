#!/bin/sh
set -euo pipefail
# Check LocalStack is running
if ! curl -s -f http://localstack:4566/_localstack/health > /dev/null 2>&1; then
    echo "❌ LocalStack is not running. Start it first with: ./start.sh"
    exit 1
fi

echo "🏗️  Deploying infrastructure to LocalStack..."

cd environments/local

echo "  Initializing Terraform..."
tflocal init -backend=false -input=false

echo "  Applying Terraform configuration..."
tflocal apply -auto-approve -input=false

echo "✅ Infrastructure deployed"

echo "📝 Generating environment file..."

tflocal output -json > "terraform_outputs.json"


# Generate env file
cat > ".env.localstack" << EOF
# Generated from LocalStack Terraform outputs
# Created: $(date)
EOF

# # Convert outputs to env vars
# jq -r 'to_entries[] | "\(.key | ascii_upcase)=\(.value.value)"' terraform_outputs.json >> .env.localstack
# Convert outputs to env vars using Python instead of jq
python3 -c "
import json
import sys

try:
    with open('terraform_outputs.json', 'r') as f:
        data = json.load(f)
    
    for key, value in data.items():
        env_key = key.upper()
        env_value = value.get('value', '')
        print(f'{env_key}={env_value}')
except Exception as e:
    print(f'Error processing JSON: {e}', file=sys.stderr)
    sys.exit(1)
" >> .env.localstack

cp .env.localstack ../../../envs/.env.localstack
rm terraform_outputs.json

echo "📋 Environment file generated: .env.localstack"
echo ""
echo "🎉 Setup complete! Generated variables:"
echo "----------------------------------------"
cat .env.localstack