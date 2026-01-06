# GitHub Actions Workflows

This repository uses GitHub Actions for CI/CD automation.

## Workflows

### 1. CI (`ci.yml`)

Runs on every push and pull request to `main` and `develop` branches.

**What it does:**
- ✅ Tests on Node.js 18.x and 20.x
- ✅ Tests with npm, yarn, and pnpm
- ✅ Runs linting
- ✅ Checks code formatting
- ✅ Builds the project
- ✅ Runs tests
- ✅ Uploads coverage reports

### 2. Release (`release.yml`)

Automatically publishes to npm when triggered.

**Triggers:**
1. **Git Tag Push** (Recommended): Push a tag like `v1.0.1`
2. **GitHub Release**: Create a release on GitHub
3. **Manual Dispatch**: Run workflow manually from Actions tab

**What it does:**
- ✅ Installs dependencies
- ✅ Runs linting
- ✅ Builds the project
- ✅ Runs tests
- ✅ Verifies version matches package.json
- ✅ Checks if version already exists on npm
- ✅ Publishes to npm (if new version)
- ✅ Creates git tag (if using workflow_dispatch)

## Setup for Automated Publishing

### Step 1: Create NPM Token

1. Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Click "Generate New Token"
3. Select "Automation" type (required for CI/CD)
4. Copy the token

### Step 2: Add GitHub Secret

1. Go to your repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `NPM_TOKEN`
4. Value: Paste your npm token
5. Click "Add secret"

### Step 3: Publish!

Now you can publish by simply:

```bash
npm version patch   # or minor, major
git push && git push --tags
```

The workflow will automatically publish to npm! 🚀

## Workflow Status

You can check workflow status at:
- https://github.com/YOUR_USERNAME/steadfast-courier/actions
