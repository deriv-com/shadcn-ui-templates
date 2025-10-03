# @deriv-com/quill-shadcn-cli

A powerful CLI tool for setting up and managing Deriv Quill shadcn/ui components in your React projects.

## Installation

```bash
npm install -g @deriv-com/quill-shadcn-cli
```

## Quick Start

```bash
# Install Deriv Quill components in your project
quill-shadcn install

# Add a specific component
quill-shadcn add button

# Update all components to latest version
quill-shadcn update
```

## Commands

### `quill-shadcn install`

Install Deriv Quill components in your project with automatic framework detection.

```bash
quill-shadcn install [options]

Options:
  -f, --framework <framework>  Framework to use (react, next, vite) (default: "react")
  -d, --dir <directory>        Directory to install in (default: ".")
  --skip-deps                  Skip installing dependencies
  --skip-config                Skip configuration setup
```

**What it does:**
- Detects your project framework (React, Next.js, Vite)
- Creates necessary directories (`src/components/ui`, `src/lib`, `src/styles`)
- Installs required dependencies
- Sets up configuration files (Tailwind, PostCSS, components.json)
- Copies component templates
- Sets up global CSS with Deriv design tokens

### `quill-shadcn add <component>`

Add a specific component to your project.

```bash
quill-shadcn add <component> [options]

Options:
  -d, --dir <directory>  Directory to add component to (default: "src/components/ui")
```

**Available components:**
- `button`, `card`, `input`, `badge`, `alert`
- `dialog`, `dropdown-menu`, `form`, `label`
- `select`, `textarea`, `checkbox`, `radio-group`
- `switch`, `slider`, `progress`, `avatar`
- `skeleton`, `table`, `tabs`, `accordion`
- And many more...

### `quill-shadcn update`

Update all Deriv Quill components to the latest version.

```bash
quill-shadcn update [options]

Options:
  -d, --dir <directory>  Project directory (default: ".")
```

**What it does:**
- Updates the `@deriv-com/quill-shadcnui-templates` package
- Updates all existing component files
- Updates configuration files (Tailwind, PostCSS, etc.)
- Preserves your custom modifications

### `quill-shadcn update-advanced`

Advanced update with multiple strategies and options.

```bash
quill-shadcn update-advanced [options]

Options:
  -d, --dir <directory>        Project directory (default: ".")
  -s, --strategy <strategy>    Update strategy (overwrite, backup, merge, prompt) (default: "overwrite")
  --force                      Force update without prompts
```

**Update Strategies:**

1. **Overwrite** (default)
   - Always overwrite existing components with latest version
   - Fast and simple, but may lose custom modifications

2. **Backup and Update**
   - Creates backup of existing component before updating
   - Safe option that preserves your original files

3. **Smart Merge**
   - Attempts to merge changes while preserving custom modifications
   - Skips components that have been significantly modified

4. **Prompt for Each**
   - Asks for confirmation before updating each component
   - Gives you full control over what gets updated

## Framework Support

The CLI automatically detects and supports:

- **React** - Standard React applications
- **Next.js** - Next.js applications with App Router
- **Vite** - Vite-based React applications

## Project Structure

After running `quill-shadcn install`, your project will have:

```
src/
├── components/
│   └── ui/           # Component files
├── lib/
│   └── utils.ts      # Utility functions
└── styles/
    └── globals.css   # Global styles with Deriv design tokens

tailwind.config.js    # Tailwind configuration
postcss.config.js     # PostCSS configuration
components.json       # shadcn/ui configuration
```

## Usage in Your Code

```tsx
import { Button, Card, Input } from './components/ui/button';
import './styles/globals.css';

function App() {
  return (
    <Card>
      <Input placeholder="Enter your name" />
      <Button>Click me</Button>
    </Card>
  );
}
```

## Updating Components

When you make changes to your components in the Deriv Quill package, consumers can easily update:

```bash
# Simple update (overwrites all components)
quill-shadcn update

# Advanced update with strategy selection
quill-shadcn update-advanced

# Update with backup strategy
quill-shadcn update-advanced --strategy backup

# Update with smart merge (preserves custom changes)
quill-shadcn update-advanced --strategy merge
```

## Design Tokens

All components use Deriv's Figma design tokens for consistent styling:

- **Colors**: Primary, secondary, accent, destructive, muted
- **Typography**: Font families, sizes, weights, line heights
- **Spacing**: Consistent spacing scale
- **Borders**: Radius and border styles
- **Shadows**: Elevation and depth

## Troubleshooting

### Component not found
Make sure you're running the command from your project root directory.

### Framework not detected
The CLI will default to React if it can't detect your framework. You can specify it manually:
```bash
quill-shadcn install --framework next
```

### Update conflicts
If you have custom modifications to components, use the smart merge strategy:
```bash
quill-shadcn update-advanced --strategy merge
```

## Contributing

This CLI is part of the Deriv Quill component library. For issues and contributions, please visit the main repository.

## License

MIT
