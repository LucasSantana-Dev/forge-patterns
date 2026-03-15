# LocalStack Patterns

LocalStack configuration for local AWS service emulation during development. Enables zero-cost local testing of AWS-dependent features (S3, DynamoDB, Lambda, SQS, SNS) without cloud accounts.

## Contents

```
patterns/localstack/
├── docker-compose.yml    # Full LocalStack service definition
└── README.md
```

## Services Emulated

```yaml
SERVICES=s3,dynamodb,lambda,apigateway,sqs,sns,iam,cloudwatch,logs
```

| Service | Use Case |
|---------|----------|
| S3 | Asset storage, export bundles |
| DynamoDB | Feature flag persistence, session data |
| Lambda | Serverless function testing |
| API Gateway | HTTP trigger testing |
| SQS/SNS | Async event bus emulation |
| CloudWatch/Logs | Log aggregation testing |

## Usage

```bash
# Start LocalStack (from project root)
docker-compose -f patterns/localstack/docker-compose.yml up -d

# Verify health
curl http://localhost:4566/_localstack/health

# Use with AWS CLI (point to LocalStack)
aws --endpoint-url=http://localhost:4566 s3 ls

# Create a test bucket
aws --endpoint-url=http://localhost:4566 s3 mb s3://my-test-bucket
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `LOCALSTACK_API_KEY` | LocalStack Pro license (optional) | Replace placeholder |
| `SERVICES` | Comma-separated AWS services to emulate | `s3,dynamodb,...` |
| `DEBUG` | Enable verbose logging | `1` |
| `DATA_DIR` | Persistence directory | `/tmp/localstack/data` |

## Network

LocalStack runs on the `uiforge-local-network` Docker network. Other services (mcp-gateway, ui-mcp) connect via hostname `localstack` on port `4566`.

## Security

The `docker-compose.yml` contains `REPLACE_WITH_LOCALSTACK_API_KEY` — replace with your actual key or remove for the free tier. Never commit real keys (BR-001 Zero Secrets).

## Integration

LocalStack is used in development environments when:
- mcp-gateway needs S3 for asset caching
- siza-gen needs DynamoDB for model registry
- Local end-to-end tests require AWS service mocking

See `patterns/docker/` for the full local development stack that includes LocalStack alongside Unleash, Redis, and Supabase.
