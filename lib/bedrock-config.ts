// AWS Bedrock Configuration for Claude 3
//
// Required Environment Variables:
// - AWS_ACCESS_KEY_ID: Your AWS access key
// - AWS_SECRET_ACCESS_KEY: Your AWS secret key
// - AWS_REGION: AWS region (e.g., 'us-east-1', 'us-west-2')
//
// Make sure your AWS account has access to Amazon Bedrock and Claude 3 models
// You may need to request access to Claude 3 models in the AWS Bedrock console

export const BEDROCK_CONFIG = {
  // Claude 3 Sonnet model identifier for Bedrock
  modelId: "anthropic.claude-3-sonnet-20240229-v1:0",

  // Alternative Claude 3 models you can use:
  // 'anthropic.claude-3-haiku-20240307-v1:0' - Faster, more cost-effective
  // 'anthropic.claude-3-opus-20240229-v1:0' - Most capable, higher cost

  // Recommended AWS regions for Bedrock Claude 3:
  supportedRegions: ["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1", "ap-northeast-1"],
}
