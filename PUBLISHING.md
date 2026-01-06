# Publishing Guide

This guide explains how to publish the `steadfast-courier` package to npm (and other package managers).

## Current Status

**The package is NOT yet published.** It will be available at:

- **npm**: https://www.npmjs.com/package/steadfast-courier
- **yarn**: https://yarnpkg.com/package/steadfast-courier
- **pnpm**: https://www.pnpmjs.com/package/steadfast-courier

## Prerequisites

1. **npm account**: Create an account at https://www.npmjs.com/signup
2. **Authentication**: Login to npm on your machine:
   ```bash
   npm login
   ```
3. **NPM_TOKEN**: For CI/CD publishing, you'll need to add `NPM_TOKEN` as a GitHub secret

## Publishing Methods

### Method 1: Manual Publishing (Recommended for first publish)

1. **Ensure everything is ready:**

   ```bash
   # Run all checks
   npm run lint
   npm run format:check
   npm run build
   npm test
   ```

2. **Verify package contents:**

   ```bash
   npm pack --dry-run
   ```

   This shows what will be included in the published package.

3. **Publish to npm:**

   ```bash
   npm publish --access public
   ```

   The `--access public` flag is required for scoped packages or first-time publishing.

4. **Verify publication:**
   ```bash
   npm view steadfast-courier
   ```

### Method 2: Automated Publishing via GitHub Actions (Recommended)

The repository includes an automated release workflow (`.github/workflows/release.yml`) that can publish to npm in three ways:

#### Option A: Git Tag Push (Recommended)

This is the simplest and most common method:

1. **Update version in package.json:**

   ```bash
   npm version patch   # for 1.0.0 -> 1.0.1
   npm version minor   # for 1.0.0 -> 1.1.0
   npm version major   # for 1.0.0 -> 2.0.0
   ```

2. **Push the tag:**

   ```bash
   git push && git push --tags
   ```

3. **The workflow automatically:**
   - Detects the tag (e.g., `v1.0.1`)
   - Runs lint, build, and tests
   - Publishes to npm if the version doesn't already exist

#### Option B: GitHub Release

1. Go to GitHub → Releases → Create a new release
2. Tag the version (e.g., `v1.0.0`)
3. The workflow will automatically publish to npm

#### Option C: Manual Workflow Dispatch

1. Go to GitHub Actions → Release workflow
2. Click "Run workflow"
3. Enter the version:
   - Specific version: `1.0.1`
   - Or use: `patch`, `minor`, or `major` to auto-bump
4. The workflow will:
   - Bump version (if using patch/minor/major)
   - Create git tag and commit
   - Publish to npm

**Setup Required:**

**Recommended: Use OIDC Trusted Publishers (More Secure)**

1. Go to npm package settings: https://www.npmjs.com/package/steadfast-courier/access
2. Scroll to "Trusted Publisher" section
3. Click "Set up connection" or "Add trusted publisher"
4. Configure:
   - **Publisher:** GitHub Actions
   - **Organization or user:** `shahria7k`
   - **Repository:** `steadfast-courier`
   - **Workflow filename:** `release.yml`
5. Click "Set up connection"

**Alternative: Using NPM Token (Legacy)**

If you prefer using a token:

1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Add a new secret named `NPM_TOKEN`
3. Get your token from https://www.npmjs.com/settings/YOUR_USERNAME/tokens
4. Create a token with "Automation" type (not "Publish" - that's for 2FA)
5. Paste the token as the secret value

## Version Management

### Updating Version

**For automated publishing (recommended):**

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major
```

This automatically:

- Updates `package.json` version
- Creates a git commit
- Creates a git tag

Then push to trigger automated publishing:

```bash
git push && git push --tags
```

The GitHub Actions workflow will automatically:

- ✅ Run lint, build, and tests
- ✅ Verify the version
- ✅ Check if version already exists
- ✅ Publish to npm (if new version)

**For manual publishing:**

Just update the version in `package.json` manually, then run `npm publish`.

## What Gets Published

Based on `package.json` `files` field, the following will be published:

- `dist/` - Compiled JavaScript and TypeScript definitions
- `README.md` - Documentation
- `CHANGELOG.md` - Change log
- `LICENSE` - License file

The following are excluded (via `.npmignore`):

- Source files (`src/`)
- Tests (`tests/`)
- Config files
- Lock files
- Development files

## After Publishing

Once published, users can install the package:

```bash
# npm
npm install steadfast-courier

# yarn
yarn add steadfast-courier

# pnpm
pnpm add steadfast-courier
```

## Package Registry URLs

After publishing, the package will be available at:

- **npm**: https://www.npmjs.com/package/steadfast-courier
- **npm registry**: https://registry.npmjs.org/steadfast-courier
- **yarn**: https://yarnpkg.com/package/steadfast-courier
- **pnpm**: https://www.pnpmjs.com/package/steadfast-courier

## Troubleshooting

### "You do not have permission to publish"

- Make sure you're logged in: `npm whoami`
- Check if the package name is available: `npm view steadfast-courier`
- If the name is taken, you may need to use a scoped package: `@your-org/steadfast-courier`

### "Package name already exists"

- The package name `steadfast-courier` might be taken
- Check availability: `npm search steadfast-courier`
- Consider using a scoped package name

### Authentication Issues

- Re-login: `npm logout` then `npm login`
- Check your npm account permissions
- Verify your token is valid
