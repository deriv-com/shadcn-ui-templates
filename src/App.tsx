import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AlertTriangle, Bell, Info } from "lucide-react"

function App() {
  const [progress, setProgress] = useState(33)
  const [sliderValue, setSliderValue] = useState([33])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Shadcn UI Templates</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive collection of all shadcn/ui components ready for V0 development and Figma-to-code workflows
            </p>
            <div className="flex justify-center gap-2">
              <Badge>TypeScript</Badge>
              <Badge variant="secondary">Tailwind CSS</Badge>
              <Badge variant="outline">Dark Mode</Badge>
              <Badge variant="destructive">All Components</Badge>
            </div>
          </div>

          {/* Alert Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Alerts & Notifications</CardTitle>
              <CardDescription>Various alert styles for different use cases</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Info</AlertTitle>
                <AlertDescription>
                  This is an informational alert with additional details.
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Something went wrong. Please check your input and try again.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Components Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>Various button styles and states</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm">Small</Button>
                    <Button>Default</Button>
                    <Button size="lg">Large</Button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Avatars & Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Avatars & Badges</CardTitle>
                <CardDescription>User avatars and status indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">shadcn</p>
                    <p className="text-sm text-muted-foreground">@shadcn</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Form Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Form Controls</CardTitle>
                <CardDescription>Input fields and form elements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="demo-input">Email</Label>
                  <Input id="demo-input" type="email" placeholder="Enter email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="demo-textarea">Message</Label>
                  <Textarea id="demo-textarea" placeholder="Enter message" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms">Accept terms and conditions</Label>
                </div>
              </CardContent>
            </Card>

            {/* Progress & Sliders */}
            <Card>
              <CardHeader>
                <CardTitle>Progress & Sliders</CardTitle>
                <CardDescription>Progress indicators and range inputs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Progress: {progress}%</Label>
                  <Progress value={progress} className="w-full" />
                  <Button 
                    size="sm" 
                    onClick={() => setProgress((progress + 10) % 101)}
                  >
                    Update Progress
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Slider: {sliderValue[0]}</Label>
                  <Slider 
                    value={sliderValue} 
                    onValueChange={setSliderValue}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Toggles & Switches */}
            <Card>
              <CardHeader>
                <CardTitle>Toggles & Switches</CardTitle>
                <CardDescription>Toggle states and switches</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Switch id="airplane-mode" />
                  <Label htmlFor="airplane-mode">Airplane Mode</Label>
                </div>
                <div className="flex items-center space-x-4">
                  <Toggle aria-label="Toggle italic">
                    <Bell className="h-4 w-4" />
                  </Toggle>
                  <Label>Notifications</Label>
                </div>
              </CardContent>
            </Card>

            {/* Loading States */}
            <Card>
              <CardHeader>
                <CardTitle>Loading States</CardTitle>
                <CardDescription>Skeleton loaders and placeholders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabbed Content */}
          <Card>
            <CardHeader>
              <CardTitle>Tabbed Interface</CardTitle>
              <CardDescription>Organized content with tabs</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="components">Components</TabsTrigger>
                  <TabsTrigger value="examples">Examples</TabsTrigger>
                  <TabsTrigger value="documentation">Docs</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This template includes all shadcn/ui components with TypeScript support, 
                    Storybook documentation, and dark mode capabilities.
                  </p>
                </TabsContent>
                <TabsContent value="components" className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Over 40+ components available including buttons, forms, navigation, 
                    data display, feedback, and layout components.
                  </p>
                </TabsContent>
                <TabsContent value="examples" className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Each component comes with comprehensive Storybook examples 
                    and interactive demos.
                  </p>
                </TabsContent>
                <TabsContent value="documentation" className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Complete documentation with usage examples, props, and 
                    customization guides.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Accordion */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Collapsible content sections</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What components are included?</AccordionTrigger>
                  <AccordionContent>
                    This template includes all available shadcn/ui components including 
                    buttons, forms, navigation, data display, feedback, and layout components.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Is TypeScript supported?</AccordionTrigger>
                  <AccordionContent>
                    Yes, all components are fully typed with TypeScript and include 
                    proper type definitions for props and variants.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How do I customize themes?</AccordionTrigger>
                  <AccordionContent>
                    Customize themes by modifying CSS variables in globals.css or 
                    updating the Tailwind configuration file.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Theme Toggle */}
          <Card>
            <CardHeader>
              <CardTitle>Theme Support</CardTitle>
              <CardDescription>Built-in light and dark mode support</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">
                  Toggle between light and dark themes to see all components adapt automatically.
                </p>
              </div>
              <Button 
                onClick={() => {
                  document.documentElement.classList.toggle('dark')
                }}
              >
                Toggle Dark Mode
              </Button>
            </CardContent>
          </Card>

          {/* Getting Started */}
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Installation and usage guide</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm space-y-2">
                <div className="text-green-600 dark:text-green-400">npm install shadcn-ui-templates</div>
                <div className="text-blue-600 dark:text-blue-400">
                  import {`{ Button, Card, Input, ... }`} from 'shadcn-ui-templates'
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex gap-2">
                <Button size="sm">View Storybook</Button>
                <Button size="sm" variant="outline">Documentation</Button>
                <Button size="sm" variant="ghost">GitHub</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App 