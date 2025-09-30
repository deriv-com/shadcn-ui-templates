# Shadcn UI Templates

A comprehensive collection of **ALL** reusable UI components built with [shadcn/ui](https://ui.shadcn.com/) designed specifically for V0 development and Figma-to-code workflows.

## Features

- 🎨 **Complete shadcn/ui collection** - All 40+ components included
- 🌓 **Dark mode support** out of the box
- 📦 **TypeScript support** for type safety
- 📚 **Storybook integration** for component documentation
- 🔧 **Customizable variants** and themes
- 🎯 **Optimized for V0** development workflows
- 🎨 **Figma integration ready** for design-to-code workflows
- ⚡ **Zero configuration** - Ready to use immediately
- 🎛️ **Design token processing** - Automated Figma token integration

## 🎨 Design Token Integration

This project includes a powerful design token processing system that can automatically apply Figma design tokens to your shadcn-ui components.

### Quick Token Setup

1. **Export tokens from Figma** (using Figma Variables plugin)
2. **Place files in `override/` directory** with standardized names:
   ```
   override/
   ├── tailwind-tokens.json    # Color palette & utilities
   ├── theme-tokens.json       # Semantic colors & typography  
   ├── mode-tokens.json        # Light/dark mode variations
   └── custom-tokens.json      # Custom responsive tokens
   ```
3. **Apply tokens to your project**:
   ```bash
   npm run tokens:apply
   ```

### Token Commands

```bash
# Apply all design tokens (updates config files)
npm run tokens:apply

# Generate summary report of available tokens
npm run tokens:report  

# Validate token files without applying changes
npm run tokens:validate
```

### What Gets Updated
- ✅ **`tailwind.config.js`** - Enhanced color palette and spacing
- ✅ **`src/styles/globals.css`** - CSS variables for theming  
- ✅ **`src/types/design-tokens.ts`** - TypeScript definitions

See [`scripts/README.md`](scripts/README.md) for comprehensive token processing documentation.

## Available Components

### Core Components (40+)
- **Accordion** - Collapsible content sections
- **Alert** - Contextual feedback messages
- **Alert Dialog** - Modal confirmation dialogs
- **Aspect Ratio** - Maintain consistent aspect ratios
- **Avatar** - User profile images with fallbacks
- **Badge** - Status indicators and labels
- **Breadcrumb** - Navigation hierarchy
- **Button** - Interactive buttons with variants
- **Calendar** - Date selection interface
- **Card** - Flexible content containers
- **Checkbox** - Boolean selection input
- **Collapsible** - Show/hide content sections
- **Command** - Command palette interface
- **Context Menu** - Right-click menus
- **Dialog** - Modal windows and overlays
- **Drawer** - Slide-out panels
- **Dropdown Menu** - Action menus
- **Form** - Form validation and management
- **Hover Card** - Contextual hover information
- **Input** - Text input fields
- **Label** - Form field labels
- **Menubar** - Application menu bars
- **Navigation Menu** - Site navigation
- **Popover** - Floating content panels
- **Progress** - Progress indicators
- **Radio Group** - Single selection from options
- **Resizable** - Resizable panels
- **Scroll Area** - Custom scrollable regions
- **Select** - Dropdown selection
- **Separator** - Visual content dividers
- **Sheet** - Sliding panels and drawers
- **Skeleton** - Loading placeholders
- **Slider** - Range input controls
- **Switch** - Toggle controls
- **Table** - Data tables
- **Tabs** - Tabbed interfaces
- **Textarea** - Multi-line text input
- **Toast** - Notification messages
- **Toggle** - Toggle buttons
- **Toggle Group** - Grouped toggle controls
- **Tooltip** - Contextual help text

### Specialized Components
- **Toaster** - Toast notification system
- **Sonner** - Enhanced toast notifications

### Utilities & Hooks
- **cn** - Tailwind CSS class name utility
- **use-toast** - Toast notification hook

## Getting Started

### 🚀 For V0 Development

**V0-Compatible Integration Methods:**

**⚙️ Option 1: Custom Registry (Recommended)**
```bash
# Add to your components.json:
{
  "registries": {
    "default": "https://ui.shadcn.com/registry",
    "custom": "https://raw.githubusercontent.com/deriv-com/shadcn-ui-templates/main/registry"
  }
}

# Then use standard shadcn CLI:
npx shadcn@latest add button --registry custom
npx shadcn@latest add card dialog input --registry custom
```

**🔧 Option 2: GitHub Template (Great for New Projects)**
- Click "Use this template" button above
- Creates new repository with all 40+ components included
- Perfect for starting fresh V0 projects

**📋 Option 3: Manual Component Copy**
```bash
# Copy individual components directly:
curl -o src/components/ui/button.tsx https://raw.githubusercontent.com/deriv-com/shadcn-ui-templates/master/registry/ui/button.tsx
curl -o src/lib/utils.ts https://raw.githubusercontent.com/deriv-com/shadcn-ui-templates/master/registry/utils.ts
```

## 🚀 Quick Start

1. **Add registry to your `components.json`:**
   ```json
   {
     "registries": {
       "default": "https://ui.shadcn.com/registry",
       "custom": "https://raw.githubusercontent.com/deriv-com/shadcn-ui-templates/master/registry"
     }
   }
   ```

2. **Install components:**
   ```bash
   npx shadcn@latest add button card dialog --registry custom
   ```

3. **Use in your project:**
   ```tsx
   import { Button } from "@/components/ui/button"
   import { Card, CardContent } from "@/components/ui/card"
   ```

### Development

1. Clone the repository:
```bash
git clone https://github.com/deriv-com/shadcn-ui-templates.git
cd shadcn-ui-templates
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) to view the comprehensive demo.

### Storybook

To view component documentation and interactive examples:

```bash
npm run storybook
```

## Usage

After adding components via the registry or installation script, import them using standard shadcn patterns:

```tsx
// Standard shadcn/ui imports - V0 friendly
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

function MyComponent() {
  return (
    <Card className={cn("p-6", "bg-background")}>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Badge variant="secondary">New Feature</Badge>
        <div className="flex gap-2">
          <Button>Get Started</Button>
          <Button variant="outline">Learn More</Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

### Available via Registry

```bash
# Add any of these components:
npx shadcn@latest add accordion alert badge button card --registry custom
npx shadcn@latest add dialog dropdown-menu form input label --registry custom  
npx shadcn@latest add select switch table tabs textarea --registry custom
# ... and 30+ more components
```

## Component Categories

### Layout & Structure
- Card, Separator, Resizable, Aspect Ratio, Scroll Area

### Navigation & Menus
- Navigation Menu, Breadcrumb, Menubar, Context Menu, Dropdown Menu

### Forms & Inputs
- Input, Textarea, Select, Checkbox, Radio Group, Switch, Slider, Calendar, Form

### Feedback & Overlays
- Alert, Toast, Dialog, Alert Dialog, Drawer, Sheet, Popover, Hover Card, Tooltip

### Data Display
- Table, Badge, Avatar, Progress, Skeleton

### Interactive Elements
- Button, Toggle, Toggle Group, Tabs, Accordion, Collapsible, Command

## Customization

### Theme Configuration

All components support both light and dark themes. Customize by modifying CSS variables:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... other variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark theme variables */
}
```

### Component Variants

Most components include multiple variants:

```tsx
// Button variants
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Destructive</Button>

// Badge variants
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>
```

## Scripts

- `npm run dev` - Start development server with comprehensive demo
- `npm run build` - Build library for production
- `npm run preview` - Preview production build
- `npm run storybook` - Start Storybook documentation
- `npm run build-storybook` - Build Storybook for deployment
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run tokens:apply` - Apply Figma design tokens to project
- `npm run tokens:report` - Generate design token summary report
- `npm run tokens:validate` - Validate design token files

## Project Structure

```
src/
├── components/
│   └── ui/                    # All 40+ shadcn/ui components
│       ├── accordion.tsx
│       ├── alert.tsx
│       ├── button.tsx
│       ├── card.tsx
│       └── ... (40+ components)
├── stories/                   # Storybook stories
│   ├── button.stories.tsx
│   ├── card.stories.tsx
│   ├── input.stories.tsx
│   └── README.md
├── hooks/
│   └── use-toast.ts           # Toast notification hook
├── lib/
│   └── utils.ts               # Utility functions
├── styles/
│   └── globals.css            # Global styles and CSS variables
├── types/
│   └── design-tokens.ts       # Auto-generated design token types
└── index.ts                   # Main export file

override/                      # Design token files (when using Figma integration)
├── tailwind-tokens.json
├── theme-tokens.json
├── mode-tokens.json
└── custom-tokens.json

scripts/
├── process-tokens.js          # Design token processing script
└── README.md                  # Token processing documentation
```

## Component Examples

### Basic Form

```tsx
import { Card, CardContent, CardHeader, CardTitle, Input, Label, Button } from 'shadcn-ui-templates'

function LoginForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter your email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Enter your password" />
        </div>
        <Button className="w-full">Sign In</Button>
      </CardContent>
    </Card>
  )
}
```

### Data Display

```tsx
import { Badge, Avatar, Card, Separator } from 'shadcn-ui-templates'

function UserProfile() {
  return (
    <Card className="p-6">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src="/avatar.jpg" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">John Doe</h3>
          <p className="text-sm text-muted-foreground">Software Engineer</p>
        </div>
        <Badge variant="secondary">Pro</Badge>
      </div>
      <Separator className="my-4" />
      <p className="text-sm">Building amazing user interfaces with React and TypeScript.</p>
    </Card>
  )
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add new components or improvements
4. Add tests and stories for new features
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Roadmap

- ✅ All core shadcn/ui components
- ✅ TypeScript support
- ✅ Storybook documentation
- ✅ Dark mode support
- ✅ Organized story structure
- ✅ Design token processing system
- [ ] Enhanced Figma integration tools
- [ ] Component composition examples
- [ ] Advanced customization guides
- [ ] Performance optimizations
- [ ] Accessibility improvements 
## Local Development & Testing

### Build for Local Testing
```bash
# Build for local testing (without GitHub Pages base path)
npm run build:local

# Build and serve locally
npm run preview:local
# Then visit http://localhost:8080
```

### Build for GitHub Pages
```bash
# Build for GitHub Pages deployment
npm run build
```

**Note**: The difference is the base path configuration:
- `build:local` uses `base: '/'` for local testing
- `build` uses `base: '/shadcn-ui-templates/'` for GitHub Pages

## 🚀 V0 Integration

This template is optimized for V0 development workflows. Here's how to use it:

### Quick Start for V0

1. **Add the custom registry to your V0 project's `components.json`:**

```json
{
  "registries": {
    "default": "https://ui.shadcn.com/registry",
    "deriv": "https://raw.githubusercontent.com/deriv-com/shadcn-ui-templates/master/registry/index.json"
  }
}
```

2. **Install components using the custom registry:**

```bash
# Install individual components
npx shadcn@latest add --registry deriv button
npx shadcn@latest add --registry deriv card

# Install all components at once
npx shadcn@latest add --registry deriv button card input textarea select checkbox radio-group switch slider progress badge avatar alert dialog sheet dropdown-menu navigation-menu tabs accordion collapsible separator skeleton toast
```

3. **Apply Figma design tokens:**

```bash
# Copy your Figma token files to override/ directory
# Then run the token processor
npm run tokens:apply
```

### Automated Setup

Use the provided setup script for quick V0 integration:

```bash
# Download and run the setup script
curl -sSL https://raw.githubusercontent.com/deriv-com/shadcn-ui-templates/master/setup-for-v0.sh | bash
```

### Custom Variants Available

- **Buy/Sell Button Variants**: `<Button variant="buy">` and `<Button variant="sell">`
- **All Figma Design Colors**: Automatically generated from your token files
- **Light/Dark Mode Support**: Proper theme switching with different colors for each mode

### V0 Best Practices

1. **Use Semantic Colors**: Always use `bg-background`, `text-foreground`, etc. instead of hardcoded colors
2. **Leverage Design Tokens**: Use `bg-chart-1`, `bg-chart-2`, etc. for consistent styling
3. **Component Composition**: Build complex UIs by composing simple components

For detailed V0 integration instructions, see [V0-INTEGRATION-GUIDE.md](./V0-INTEGRATION-GUIDE.md).


## 🔄 Registry Synchronization

The project includes an automated registry sync system to keep the V0 registry up-to-date with source components.

### Manual Sync
```bash
# Sync registry with current components
npm run registry:sync

# Generate sync report
npm run registry:report
```

### Automated Sync
The registry is automatically synced via GitHub Actions when components are updated. The sync process:

- ✅ Copies all 43 components from `src/components/ui/` to `registry/ui/`
- ✅ Copies utilities from `src/lib/` to `registry/lib/`
- ✅ Copies hooks from `src/hooks/` to `registry/hooks/`
- ✅ Generates updated `registry/index.json` with component metadata
- ✅ Maintains component dependencies and relationships

### What Gets Synced
- **Components**: All shadcn/ui components with custom variants
- **Utilities**: `utils.ts` with `cn` function
- **Hooks**: `use-toast.ts` for toast notifications
- **Dependencies**: Component import relationships
- **Metadata**: Component types, files, and registry information

The registry is always kept in sync with the source components, ensuring V0 users get the latest versions automatically.

