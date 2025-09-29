# Storybook Stories

This directory contains all Storybook stories for the shadcn-ui-templates components.

## Organization

Stories are organized by component and grouped under the `UI/` category in Storybook:

- `button.stories.tsx` - Button component with all variants and states
- `card.stories.tsx` - Card component with different layouts and usage examples
- `input.stories.tsx` - Input component with various types and states

## Adding New Stories

When creating stories for new components:

1. Create a new `[component-name].stories.tsx` file in this directory
2. Import the component using relative paths: `../components/ui/[component-name]`
3. Follow the existing story structure and naming conventions
4. Use the `UI/ComponentName` title pattern for consistency

## Example Story Structure

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from '../components/ui/component-name';

const meta = {
  title: 'UI/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // Define component props and controls
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Default props
  },
};

// Additional story variants...
```

## Running Storybook

To view the stories:

```bash
npm run storybook
```

This will start the Storybook development server with all stories available for interactive testing and documentation. 