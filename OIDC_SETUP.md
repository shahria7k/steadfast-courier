# OIDC Trusted Publisher Setup Guide

This guide explains how to set up npm Trusted Publishers using OpenID Connect (OIDC) for secure, tokenless publishing from GitHub Actions.

## Why Use OIDC?

✅ **More Secure** - No long-lived tokens to manage or rotate  
✅ **Automatic** - No secrets to configure in GitHub  
✅ **Auditable** - Better tracking of who published what  
✅ **Recommended** - npm's recommended approach for CI/CD

## Setup Steps

### Step 1: Navigate to Package Settings

1. Go to your npm package: https://www.npmjs.com/package/steadfast-courier
2. Click on **"Package settings"** or navigate directly to:
   https://www.npmjs.com/package/steadfast-courier/access

### Step 2: Configure Trusted Publisher

1. Scroll down to the **"Trusted Publisher"** section
2. Click **"Set up connection"** or **"Add trusted publisher"**

### Step 3: Fill in the Details

Fill in the form with these values:

- **Publisher:** `GitHub Actions` (select from dropdown)
- **Organization or user:** `shahria7k`
- **Repository:** `steadfast-courier`
- **Workflow filename:** `release.yml`
  - ⚠️ **Important:** This must match exactly: `.github/workflows/release.yml`
- **Environment name:** (Leave empty - optional, for additional security)

### Step 4: Save

Click **"Set up connection"** to save the configuration.

## Verification

After setup, you can verify it's working:

1. **Check the Trusted Publisher list:**
   - You should see `shahria7k/steadfast-courier/.github/workflows/release.yml` listed

2. **Test by publishing:**
   ```bash
   npm version patch
   git push && git push --tags
   ```
   The workflow should publish without needing `NPM_TOKEN`!

## How It Works

1. **GitHub Actions** runs the `release.yml` workflow
2. **OIDC** provides a short-lived token to authenticate with npm
3. **npm** verifies the token matches your Trusted Publisher configuration
4. **Publishing** happens automatically - no secrets needed!

## Workflow Requirements

The workflow file (`.github/workflows/release.yml`) must have:

```yaml
permissions:
  contents: write
  id-token: write  # Required for OIDC!
```

And use `actions/setup-node@v4` with `registry-url`:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20.x'
    registry-url: 'https://registry.npmjs.org'
    # No NODE_AUTH_TOKEN needed!
```

## Troubleshooting

### "Workflow filename not found"
- Verify the file exists: `.github/workflows/release.yml`
- Check the filename matches exactly (case-sensitive)
- Ensure it's committed to the repository

### "Repository not found"
- Verify repository name: `shahria7k/steadfast-courier`
- Check you have access to the repository
- Ensure the repository is public or you have proper permissions

### "Authentication failed"
- Check workflow permissions include `id-token: write`
- Verify Trusted Publisher is configured correctly
- Ensure you're using `actions/setup-node@v4` or later

### "Permission denied"
- Verify you're the package owner on npm
- Check the repository has the correct permissions
- Ensure the workflow file is in the default branch (usually `main`)

## Benefits Over Tokens

| Feature | OIDC | NPM_TOKEN |
|---------|------|-----------|
| Security | ✅ Short-lived tokens | ❌ Long-lived tokens |
| Rotation | ✅ Automatic | ❌ Manual |
| Secrets | ✅ None needed | ❌ Must store in GitHub |
| Auditing | ✅ Better tracking | ⚠️ Limited |
| Setup | ✅ One-time config | ⚠️ Token management |

## Next Steps

Once configured, publishing is as simple as:

```bash
npm version patch && git push && git push --tags
```

No tokens, no secrets, just secure automated publishing! 🚀
