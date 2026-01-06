# CI/CD Setup Guide

This guide explains how to set up automated npm publishing via GitHub Actions.

## Quick Start

### 1. Set up Trusted Publisher (One-time setup) - Recommended

**Using OIDC (OpenID Connect) is more secure than tokens!**

1. **Go to npm package settings:**
   - Navigate to https://www.npmjs.com/package/steadfast-courier
   - Click on "Package settings" or go to: https://www.npmjs.com/package/steadfast-courier/access
   - Scroll to "Trusted Publisher" section

2. **Configure Trusted Publisher:**
   - Click "Set up connection" or "Add trusted publisher"
   - **Publisher:** Select "GitHub Actions"
   - **Organization or user:** Enter `shahria7k`
   - **Repository:** Enter `steadfast-courier`
   - **Workflow filename:** Enter `release.yml` (must match `.github/workflows/release.yml`)
   - **Environment name:** Leave empty (optional, for additional security)
   - Click "Set up connection"

3. **That's it!** No tokens needed. The workflow will automatically authenticate using OIDC.

**Alternative: Using NPM Token (Legacy method)**

If you prefer using a token instead:

1. Create an npm automation token: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Add it as `NPM_TOKEN` in GitHub Secrets
3. The workflow will fall back to token authentication if OIDC is not configured

### 2. Publish a New Version

**Method 1: Using npm version (Recommended)**

```bash
# Bump version (automatically updates package.json, creates commit and tag)
npm version patch   # 1.0.0 → 1.0.1
# or
npm version minor    # 1.0.0 → 1.1.0
# or
npm version major    # 1.0.0 → 2.0.0

# Push code and tags (triggers automated publishing)
git push && git push --tags
```

That's it! The GitHub Actions workflow will:

- ✅ Run lint, build, and tests
- ✅ Verify the version
- ✅ Check if version already exists
- ✅ Publish to npm automatically

**Method 2: Manual Workflow Dispatch**

1. Go to GitHub → Actions → Release workflow
2. Click "Run workflow"
3. Enter version:
   - `patch`, `minor`, or `major` (auto-bumps)
   - Or specific version like `1.0.1`
4. Click "Run workflow"

**Method 3: Create GitHub Release**

1. Go to GitHub → Releases → Create a new release
2. Tag: `v1.0.1` (must start with `v`)
3. The workflow will automatically publish

## How It Works

The `.github/workflows/release.yml` workflow:

1. **Triggers on:**
   - Git tag push (e.g., `v1.0.1`)
   - GitHub Release creation
   - Manual workflow dispatch

2. **Runs checks:**
   - Installs dependencies
   - Lints code
   - Builds project
   - Runs tests

3. **Publishes:**
   - Verifies version matches package.json
   - Checks if version already exists on npm
   - Publishes to npm (if new version)
   - Creates summary with npm link

## Verification

After publishing, verify:

```bash
# Check published version
npm view steadfast-courier version

# View package info
npm view steadfast-courier

# Install in another project
npm install steadfast-courier
```

## Troubleshooting

### "Authentication failed" or "Permission denied"

- **If using OIDC:** Verify Trusted Publisher is configured correctly:
  - Check workflow filename matches: `release.yml`
  - Verify repository name: `shahria7k/steadfast-courier`
  - Ensure workflow file exists: `.github/workflows/release.yml`
  - Check permissions in workflow include `id-token: write`
- **If using token:** Make sure `NPM_TOKEN` is set in GitHub Secrets
  - Token must be "Automation" type, not "Publish"

### "Version already exists"

- The workflow checks if version exists before publishing
- If it exists, publishing is skipped (no error)
- Use a different version number

### "Permission denied"

- Check your npm token has publish permissions
- Verify you're the package owner on npm
- Token might be expired - generate a new one

### Workflow not triggering

- For tag push: Make sure tag format is `v*.*.*` (e.g., `v1.0.1`)
- Check workflow file exists: `.github/workflows/release.yml`
- Verify GitHub Actions are enabled for your repo

## Workflow Status

Monitor workflow runs at:

- https://github.com/YOUR_USERNAME/steadfast-courier/actions

Each run shows:

- ✅ Success (published)
- ⚠️ Skipped (version exists)
- ❌ Failed (check logs)

## Best Practices

1. **Always test locally first:**

   ```bash
   npm run lint
   npm run build
   npm test
   ```

2. **Use semantic versioning:**
   - `patch`: Bug fixes (1.0.0 → 1.0.1)
   - `minor`: New features (1.0.0 → 1.1.0)
   - `major`: Breaking changes (1.0.0 → 2.0.0)

3. **Update CHANGELOG.md** before publishing

4. **Tag releases** with descriptive messages:
   ```bash
   git tag -a v1.0.1 -m "Fix webhook handler callback issue"
   ```

## Next Steps

Once set up, publishing is as simple as:

```bash
npm version patch && git push && git push --tags
```

The CI/CD pipeline handles the rest! 🚀
