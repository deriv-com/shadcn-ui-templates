# @deriv-com/quill-shadcn-cli

A simple CLI tool for setting up Deriv Quill shadcn/ui components in your React projects.

## Installation

```bash
npm install -g @deriv-com/quill-shadcn-cli
```

## Quick Start

```bash
# Complete setup (installs all components + config)
quill-shadcn install

# Update to latest version
quill-shadcn update
```

## Commands

### `quill-shadcn install`

Complete setup that installs all Deriv Quill components and configuration.

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
- Copies all 43 component templates
- Sets up global CSS with Deriv design tokens

### `quill-shadcn update`

Update all components to the latest version.

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

## What You Get

**All 43 Components:**
- `button`, `card`, `input`, `badge`, `alert`
- `dialog`, `dropdown-menu`, `form`, `label`
- `select`, `textarea`, `checkbox`, `radio-group`
- `switch`, `slider`, `progress`, `avatar`
- `skeleton`, `table`, `tabs`, `accordion`
- And many more...

**Complete Configuration:**
- ✅ **Tailwind CSS** - Complete configuration with Deriv design tokens
- ✅ **PostCSS** - Processing setup
- ✅ **Global CSS** - All design variables and tokens
- ✅ **Components.json** - shadcn/ui configuration
- ✅ **Utils** - Component utility functions

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
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import './styles/globals.css';

function App() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to Deriv Quill</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter your name" />
        <Button>Submit</Button>
      </CardContent>
    </Card>
  );
}
```

## Updating Components

When you make changes to your components in the Deriv Quill package, consumers can easily update:

```bash
# Simple update (overwrites all components)
quill-shadcn update

# That's it! Simple and clean.
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

### Update issues
If you have issues updating, try:
```bash
quill-shadcn update --force
```

## Contributing

This CLI is part of the Deriv Quill component library. For issues and contributions, please visit the main repository.

## License

MIT
