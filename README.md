# Email Review Chatbot with AWS Bedrock Claude 3

An AI-powered email review and redrafting application that uses AWS Bedrock with Claude 3 to analyze and improve email communications based on empathy, tone, grammar, professionalism, and clarity.

## Features

- **AI-Powered Analysis**: Uses AWS Bedrock Claude 3 Sonnet for intelligent email review
- **Five Key Criteria**: Evaluates empathy, tone & trust-building, grammar, professionalism, and non-technical clarity
- **Real-time Streaming**: Provides immediate feedback as the AI analyzes emails
- **Complete Redrafting**: Generates professionally improved versions with explanations
- **Sample Templates**: Includes common email scenarios for testing

## AWS Bedrock Setup

### Prerequisites

1. **AWS Account**: You need an active AWS account
2. **Bedrock Access**: Request access to Amazon Bedrock in your AWS console
3. **Claude 3 Access**: Request access to Anthropic Claude 3 models in Bedrock
4. **IAM Permissions**: Ensure your AWS credentials have Bedrock permissions

### Required Environment Variables

Create a `.env.local` file in your project root:

\`\`\`bash
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
\`\`\`

### Supported AWS Regions

Claude 3 is available in these regions:
- `us-east-1` (N. Virginia)
- `us-west-2` (Oregon)
- `eu-west-1` (Ireland)
- `ap-southeast-1` (Singapore)
- `ap-northeast-1` (Tokyo)

### IAM Policy

Your AWS user/role needs these permissions:

\`\`\`json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeModel",
                "bedrock:InvokeModelWithResponseStream"
            ],
            "Resource": [
                "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-*"
            ]
        }
    ]
}
\`\`\`

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your AWS credentials and environment variables
4. Run the development server: `npm run dev`

## Usage

1. Enter your email draft in the input area
2. Optionally provide context (e.g., "Customer complaint response")
3. Click "Review & Redraft Email"
4. Review the AI analysis and redrafted version
5. Use the improved email in your communications

## Model Information

This application uses **Claude 3 Sonnet** (`anthropic.claude-3-sonnet-20240229-v1:0`) which provides:
- Excellent balance of capability and speed
- Strong reasoning and analysis abilities
- Professional writing and communication skills
- Cost-effective for production use

You can switch to other Claude 3 variants by updating the model ID in the API route:
- **Claude 3 Haiku**: Faster and more economical
- **Claude 3 Opus**: Most capable but higher cost
