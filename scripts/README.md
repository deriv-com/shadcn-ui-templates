# Design Token Processing Scripts

This directory contains scripts for processing and applying Figma design tokens to the shadcn-ui project.

## 📁 File Structure

```
override/                     # Design token files (standardized names)
├── tailwind-tokens.json     # Complete Tailwind CSS color palette & utilities
├── theme-tokens.json        # Enhanced shadcn/ui semantic colors
├── mode-tokens.json         # Light/dark mode variations
└── custom-tokens.json       # Custom responsive typography & spacing

scripts/
└── process-tokens.js        # Main token processing script
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Process Design Tokens
```bash
# Apply all design tokens to your project
npm run tokens:apply

# Generate a summary report of available tokens
npm run tokens:report

# Validate token files without applying
npm run tokens:validate
```

### 3. View Changes
```bash
npm run dev
```

## 📋 Available Commands

### `npm run tokens:apply`
Processes all design token files and applies them to your project:
- ✅ Updates `tailwind.config.js` with new color palette and spacing
- ✅ Updates `src/styles/globals.css` with CSS variables  
- ✅ Generates `src/types/design-tokens.ts` with TypeScript types

### `npm run tokens:report`
Generates a comprehensive summary of your design tokens:
- 🎨 Color families and shades
- 📏 Spacing values
- 📝 Typography styles
- 📊 Summary statistics

### `npm run tokens:validate`
Validates all token files without making changes:
- ✅ Checks JSON syntax
- ✅ Verifies file structure
- ✅ Reports any issues

## 🎨 What Gets Generated

### Enhanced Tailwind Config
```javascript
// New colors from your design system
colors: {
  // Standard shadcn colors
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  
  // Enhanced palette from Figma
  coral: {
    50: "#fff1f2",
    100: "#ffe4e6",
    // ... full shade range
  },
  slate: {
    50: "#f8fafc", 
    // ... custom slate variations
  }
}
```

### CSS Variables
```css
:root {
  --primary: 255, 68, 80;
  --secondary: 248, 250, 252;
  --accent: 235, 237, 241;
  /* ... semantic colors */
}

.dark {
  --primary: 255, 68, 80;
  --secondary: 23, 28, 37;
  --accent: 17, 20, 27;
  /* ... dark mode variations */
}
```

### TypeScript Types
```typescript
export interface DesignTokens {
  colors: {
    coral: {
      "50": string;
      "100": string;
      // ... all shades
    };
    // ... all color families
  };
  typography: {
    "heading-xl": {
      "font-size": any;
      "line-height": any;
      // ... typography properties
    };
  };
}
```

## ⚙️ Advanced Usage

### Custom Token Directory
```bash
node scripts/process-tokens.js apply --tokens-dir custom-tokens
```

### Custom Output Directory
```bash
node scripts/process-tokens.js apply --output-dir build
```

### Verbose Logging
```bash
node scripts/process-tokens.js apply --verbose
```

## 🎯 Design Token Categories

### 1. Tailwind Tokens (`tailwind-tokens.json`)
- **Complete color palette**: All Tailwind colors + custom colors (coral, cherry, slate)
- **Spacing system**: 0-96px + fractional values (0.5, 1.5, etc.)
- **Typography**: Font sizes, line heights, weights
- **Effects**: Shadows, blur, border radius
- **Breakpoints**: Responsive design breakpoints

### 2. Theme Tokens (`theme-tokens.json`)
- **Semantic colors**: Enhanced shadcn/ui color system
- **Typography scales**: Base text styles and font families
- **Component colors**: Chart colors, sidebar theming
- **Effects system**: Advanced shadow and blur tokens

### 3. Mode Tokens (`mode-tokens.json`)
- **Light/Dark modes**: Automatic theme switching
- **Alpha utilities**: Transparency variations (10%, 20%, etc.)
- **Conditional colors**: Colors that change based on context
- **Sidebar system**: Complete sidebar color scheme

### 4. Custom Tokens (`custom-tokens.json`)
- **Responsive typography**: Desktop vs mobile heading scales
- **Container system**: Padding and spacing for layouts
- **Section spacing**: Consistent vertical rhythm
- **Title gaps**: Spacing between headings and content

## 🔧 Script Features

### Intelligent Processing
- ✅ **Color conversion**: Figma RGB → CSS RGB/HSL
- ✅ **Name normalization**: `tailwind colors/blue/500` → `blue.500`
- ✅ **Mode mapping**: Automatic light/dark theme generation
- ✅ **Type safety**: Generated TypeScript definitions

### Error Handling
- ✅ **Validation**: JSON syntax and structure checking
- ✅ **Graceful failures**: Continues processing if one file fails
- ✅ **Detailed logging**: Clear success/error messages
- ✅ **File size reporting**: Shows processed file sizes

### CLI Interface
- ✅ **Multiple commands**: apply, report, validate
- ✅ **Flexible options**: Custom directories and verbose logging
- ✅ **Color-coded output**: Easy-to-read console messages

## 📂 Token File Structure

Each token file follows the Figma Variables API format:

```json
{
  "id": "VariableCollectionId:...",
  "name": "Collection Name", 
  "modes": {
    "mode-id": "Mode Name"
  },
  "variables": [
    {
      "id": "VariableID:...",
      "name": "token/name/path",
      "type": "COLOR|FLOAT|STRING",
      "valuesByMode": {
        "mode-id": "value"
      },
      "resolvedValuesByMode": {
        "mode-id": {
          "resolvedValue": "actual-value"
        }
      }
    }
  ]
}
```

## 🐛 Troubleshooting

### Common Issues

**❌ "Token file not found"**
```bash
# Ensure files are named correctly:
override/tailwind-tokens.json  ✅
override/1. TailwindCSS.json   ❌
```

**❌ "Failed to load tokens"**
- Check JSON syntax with `npm run tokens:validate`
- Ensure files are exported from Figma properly

**❌ "Command not found"**
```bash
# Install dependencies first
npm install
```

### Getting Fresh Tokens from Figma

1. **Export from Figma**:
   - Figma → Plugins → Variables → Export
   - Save as JSON files

2. **Rename files**:
   ```bash
   mv "1. TailwindCSS.json" override/tailwind-tokens.json
   mv "2. Theme.json" override/theme-tokens.json  
   mv "3. Mode.json" override/mode-tokens.json
   mv "4. Custom.json" override/custom-tokens.json
   ```

3. **Process tokens**:
   ```bash
   npm run tokens:apply
   ```

## 🚀 Next Steps

After processing your design tokens:

1. **Review changes**: Check `tailwind.config.js` and `globals.css`
2. **Update components**: Use new color classes in your components
3. **Test themes**: Verify light/dark mode switching works
4. **Build project**: Run `npm run build` to ensure no issues

## 💡 Tips

- 🔄 **Re-run anytime**: Safe to run `tokens:apply` multiple times
- 📊 **Check reports**: Use `tokens:report` to see what's available
- 🎨 **Preview changes**: Start dev server to see design updates immediately
- 🔍 **Validate first**: Run `tokens:validate` before applying if unsure

---

For questions or issues, check the generated files in `src/types/design-tokens.ts` for available token names and values. 