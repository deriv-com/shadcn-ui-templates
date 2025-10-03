# CLI Setup Guide

## Quick Fix for "permission denied" error

The CLI isn't working because it needs proper permissions and installation. Here's how to fix it:

### Option 1: Install Globally (Recommended)

```bash
# Navigate to CLI directory
cd cli

# Make the binary executable
chmod +x dist/index.js

# Install globally
npm install -g .

# Test the CLI
quill-shadcn -v
```

### Option 2: Link Locally

```bash
# Navigate to CLI directory
cd cli

# Make the binary executable
chmod +x dist/index.js

# Link the CLI
npm link

# Test the CLI
quill-shadcn -v
```

### Option 3: Run Directly (For Testing)

```bash
# Run the CLI directly with node
node cli/dist/index.js -v
node cli/dist/index.js install --help
```

## Troubleshooting

If you still get "permission denied":

1. **Check file permissions**:
   ```bash
   ls -la cli/dist/index.js
   ```
   Should show `-rwxr-xr-x` (executable)

2. **Make sure the shebang is correct**:
   ```bash
   head -1 cli/dist/index.js
   ```
   Should show `#!/usr/bin/env node`

3. **Check if node is in PATH**:
   ```bash
   which node
   ```

## Testing the CLI

Once installed, test with:

```bash
# Check version
quill-shadcn -v

# See help
quill-shadcn --help

# Test install command
quill-shadcn install --help
```

## Development

For development, you can run:

```bash
# Build the CLI
cd cli && npm run build

# Test locally
node dist/index.js -v
```
