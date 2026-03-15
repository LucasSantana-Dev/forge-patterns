# LocalStack Patterns

LocalStack configuration for local AWS service emulation during development. Enables zero-cost local testing of S3, DynamoDB, Lambda, SQS, SNS, and more without cloud accounts.

## Contents

```
patterns/localstack/
├── docker-compose.yml    # Full LocalStack service definition
└── README.md
```

## Services Emulated

`s3`, `dynamodb`, `lambda`, `apigateway`, `sqs`, `sns`, `iam`, `cloudwatch`, `logs`

## Usage

```bash
# Start LocalStack
docker-compose -f patterns/localstack/docker-compose.yml up -d

# Verify health
curl http://localhost:4566/_localstack/health

# Use with AWS CLI
aws --endpoint-url=http://localhost:4566 s3 mb s3://my-test-bucket
```

## Network

Runs on `uiforge-local-network`. Other containers connect via hostname `localstack:4566`.

## Security

The compose file contains `REPLACE_WITH_LOCALSTACK_API_KEY` placeholder — replace for Pro features or remove for free tier. Never commit real keys (BR-001 Zero Secrets).
