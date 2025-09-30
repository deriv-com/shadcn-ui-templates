# V0 Integration Guide

## 🎯 For V0 AI: Essential Setup Steps

### 1. Update components.json
Add this to the `registries` section:
```json
{
  "registries": {
    "default": "https://raw.githubusercontent.com/deriv-com/shadcn-ui-templates/master/registry/index.json",
    "shadcn": "https://ui.shadcn.com/registry"
  }
}
```

### 2. Copy Styling Files
```bash
# Create styles directory
mkdir -p src/styles

# Download global CSS with Figma design tokens
curl -o src/styles/globals.css https://raw.githubusercontent.com/deriv-com/shadcn-ui-templates/master/registry/styles/globals.css

# Download Tailwind config with custom colors
curl -o tailwind.config.js https://raw.githubusercontent.com/deriv-com/shadcn-ui-templates/master/registry/tailwind.config.js

# Download PostCSS config
curl -o postcss.config.js https://raw.githubusercontent.com/deriv-com/shadcn-ui-templates/master/registry/postcss.config.js
```

### 3. Install Components
```bash
npx shadcn@latest add [component-name]
```

## 🎨 What You Get

- ✅ **Global CSS** with all Figma design tokens
- ✅ **Tailwind Config** with custom colors
- ✅ **43 Components** with custom variants
- ✅ **Buy/Sell Button Variants** (`variant="buy"`, `variant="sell"`)
- ✅ **Light/Dark Mode** with different colors
- ✅ **All Figma Colors** automatically applied

## 🚀 Usage

```tsx
// Custom button variants
<Button variant="buy">Buy Now</Button>
<Button variant="sell">Sell Now</Button>

// Design token colors
<div className="bg-background text-foreground">
  <div className="bg-primary text-primary-foreground">
    <div className="bg-chart-1">Chart 1</div>
  </div>
</div>
```

That's it! Your V0 project now has complete access to all styling and components. 🎉
