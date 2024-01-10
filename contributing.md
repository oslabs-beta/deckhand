# Contributing to Deckhand

Welcome to the Deckhand open source community! We're excited to have you onboard and appreciate your interest in contributing to our project.

## Reporting Bugs

Encountered a bug? We would love to hear about it. Here's how you can report it:

1. Visit our GitHub repository.
2. Navigate to the "Issues" tab.
3. Create a new issue with a clear description and instructions on how to reproduce the bug.
4. Feel free to submit a pull request if you have a fix!

## Initialization

### Development Environment Setup

Before starting, ensure you have the following tools and utilities installed:

- Docker (must be running in the background)
- AWS CLI
- kubectl
- Terraform

### Configuring Environmental Variables

For local development, set up your environmental variables as follows:

1. Refer to the `.env.example` file in the root directory.
2. Provide your own instances of GitHub OAuth and PostgreSQL.

#### GitHub OAuth Configuration

- Create a GitHub OAuth application in your account.
- Set the Client ID and Client Secret:
  - `GITHUB_CLIENT_ID=your_github_client_id_here`
  - `GITHUB_CLIENT_SECRET=your_github_client_secret_here`

#### PostgreSQL Configuration

- Provide the URI for your PostgreSQL database:
  - `PG_URI=postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE`

### Clone Repository and Run

```bash
git clone <repository-url>
cd <repository-name>
npm install
npm run tf-init
npm run dev
```

## Pull Requests

All code changes happen through GitHub Pull Requests and we actively welcome them. To submit your pull request, follow the steps below:

- Fork and clone the repository.
- Create your feature branch.
- Make sure to cover your code with tests and that your code is linted in accordance with our linting specifications (see coding style below).
- Commit your changes locally with a clear commit message and then push to your remote repository.
- Create a Pull Request. Your pull request must have an explanation of your changes in order to be considered.

## Linting Specifications

- Tabs should be two spaces
- Use single quotes
