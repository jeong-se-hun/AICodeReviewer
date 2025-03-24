[Korean](./docs/readmes/README_KO.md)

# AICodeReviewer

AICodeReviewer is an automated code review tool powered by AI.
It enables developers to review code more efficiently and improve its quality by automating the code review process through GitHub Actions.

## Key Features

- AI-based PR analysis and improvement suggestions

- Automatically generates review comments on GitHub Pull Requests

## How to Use

AICodeReviewer operates using GitHub Actions. Follow the steps below to set up the workflow.

### 1. Add a Workflow File

Add a file named /.github/workflows/ai-code-reviewer.yml to the root directory of your project.

```yaml
name: AI Code Reviewer

on:
  pull_request:
    branches:
      - main # Change this to the branch you want to review
    types:
      - opened
      - synchronize

permissions:
  pull-requests: write
  #contents: read # Required for private repositories

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Current Repository
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Checkout AI Code Review
        uses: actions/checkout@v3
        with:
          repository: jeong-se-hun/AICodeReviewer

      - name: Install Dependencies
        run: npm install

      - name: Run AI Review Script
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITHUB_PR_NUMBER: ${{ github.event.pull_request.number }}
          GITHUB_REPOSITORY: ${{ github.repository }}
          AI_API_KEY: ${{ secrets.AI_API_KEY }}
          AI_MODEL: "Enter the model name you wish to use" # Example: "gemini-2.0-pro-exp-02-05"
          AI_MODEL_PROVIDER: "Enter the model provider" # Check the README for available AI service providers
          REVIEW_FEEDBACK_LANGUAGE: "English" # Set the language for review feedback
        run: node index.js
```

### 2. Set Up AI_API_KEY

1. Go to your repository's Settings > Secrets and variables > Actions.

2. In the Secrets tab, click the New repository secret button.

3. Name the secret as AI_API_KEY and input your AI model's API key as the value.

### 3. Configure AI_MODEL

To change the AI model, modify the `AI_MODEL` value in the `/.github/workflows/ai-code-review.yml` file.

- **Example**:

```yaml
AI_MODEL: "gemini-2.0-pro-exp-02-05"
```

### 4. Configure AI_MODEL_PROVIDER

To change the AI model provider, modify the `AI_MODEL_PROVIDER` value in the `/.github/workflows/ai-code-review.yml` file.

#### Available AI Service Providers

- **gemini**
- **mistral**
- **azure**
- **openai**

> ℹ️ More models will be added soon! If you have a desired AI model, please contribute or create an issue!

### 5. Set REVIEW_FEEDBACK_LANGUAGE

Specify the language in which the AI should provide review feedback.
This is used when prompting.

```js
`Please provide feedback in ${REVIEW_FEEDBACK_LANGUAGE || "Korean"}`;
```

To change the review feedback language, modify the `REVIEW_FEEDBACK_LANGUAGE` value in the `/.github/workflows/ai-code-review.yml` file.

- **Format**: Enter the language name (e.g., "Korean", "English", "한국어", "영어"). The case is ignored.
- **Default**: If not set, it defaults to "Korean".
- **Example**:
  ```yaml
  REVIEW_FEEDBACK_LANGUAGE: "English" # Receive feedback in English
  ```

<br/>

### Review Example

![AI Code Review Example](./docs/images/ai-code-review-example.png)
