import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Separator } from '@/components/ui/separator';
import {
  Sparkles,
  ArrowLeft,
  BookOpen,
  Play,
  Settings,
  Share2,
  Download,
  Palette,
  Edit3,
  Eye,
  ChevronRight
} from 'lucide-react';

export const Documentation = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Play,
      content: {
        title: 'Getting Started with LANDING PAGE GENERATOR',
        description: 'Learn how to create your first landing page in minutes',
        steps: [
          {
            title: 'Step 1: Access the Generator',
            description: 'Click on "Start Building" from the homepage to access the LANDING PAGE GENERATOR.',
            tip: 'You can also navigate directly to /generator'
          },
          {
            title: 'Step 2: Fill Out the Form',
            description: 'Provide information about your product, including name, description, target audience, and industry.',
            tip: 'Be specific about your product to get better AI-generated content'
          },
          {
            title: 'Step 3: Generate Your Page',
            description: 'Click "Generate Landing Page" and wait for AI to create your custom page.',
            tip: 'Generation typically takes 10-30 seconds'
          },
          {
            title: 'Step 4: Customize and Export',
            description: 'Use the editor panel to customize your page, then export or share when ready.',
            tip: 'You can regenerate sections if you\'re not satisfied with the initial result'
          }
        ]
      }
    },
    {
      id: 'customization',
      title: 'Customization',
      icon: Palette,
      content: {
        title: 'Customizing Your Landing Page',
        description: 'Learn how to personalize your landing page design and content',
        features: [
          {
            title: 'Theme Settings',
            description: 'Change colors, fonts, and overall theme of your landing page',
            icon: Palette
          },
          {
            title: 'Content Editing',
            description: 'Edit text, headlines, and descriptions directly in the editor',
            icon: Edit3
          },
          {
            title: 'Section Management',
            description: 'Add, remove, or reorder sections to match your needs',
            icon: Settings
          },
          {
            title: 'Live Preview',
            description: 'See changes in real-time with our live preview feature',
            icon: Eye
          }
        ]
      }
    },
    {
      id: 'sharing',
      title: 'Sharing & Export',
      icon: Share2,
      content: {
        title: 'Sharing and Exporting Your Landing Page',
        description: 'Multiple ways to share and deploy your landing page',
        options: [
          {
            title: 'Share Link',
            description: 'Generate a shareable link that others can view instantly',
            features: ['Instant sharing', 'No setup required', 'Mobile responsive']
          },
          {
            title: 'Export HTML',
            description: 'Download a complete HTML file for self-hosting',
            features: ['Standalone file', 'No dependencies', 'SEO optimized']
          },
          {
            title: 'Social Media',
            description: 'Share directly to social media platforms',
            features: ['Twitter integration', 'LinkedIn sharing', 'Facebook posts', 'Email sharing']
          }
        ]
      }
    }
  ];

  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-blue-50 dark:from-primary/10 dark:via-background dark:to-blue-950/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Documentation</span>
            </div>
          </div>

          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Table of Contents</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <Button
                      key={section.id}
                      variant={activeSection === section.id ? "secondary" : "ghost"}
                      className="w-full justify-start gap-2"
                      onClick={() => setActiveSection(section.id)}
                    >
                      <section.icon className="w-4 h-4" />
                      {section.title}
                      {activeSection === section.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </Button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {currentSection && <currentSection.icon className="w-6 h-6 text-primary" />}
                  <Badge variant="secondary">{currentSection?.title}</Badge>
                </div>
                <CardTitle className="text-2xl">{currentSection?.content.title}</CardTitle>
                <CardDescription className="text-base">
                  {currentSection?.content.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Getting Started Content */}
                {activeSection === 'getting-started' && currentSection?.content.steps && (
                  <div className="space-y-6">
                    {currentSection.content.steps.map((step, index) => (
                      <div key={index} className="border-l-4 border-primary pl-6">
                        <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground mb-2">{step.description}</p>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="text-sm"><strong>💡 Tip:</strong> {step.tip}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Customization Content */}
                {activeSection === 'customization' && currentSection?.content.features && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentSection.content.features.map((feature, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <feature.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Sharing Content */}
                {activeSection === 'sharing' && currentSection?.content.options && (
                  <div className="space-y-6">
                    {currentSection.content.options.map((option, index) => (
                      <Card key={index} className="p-6">
                        <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
                        <p className="text-muted-foreground mb-4">{option.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {option.features.map((feature, featureIndex) => (
                            <Badge key={featureIndex} variant="outline" className="justify-center">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                <Separator />

                {/* Quick Actions */}
                <div className="bg-muted/30 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={() => navigate('/generator')} className="gap-2">
                      <Play className="w-4 h-4" />
                      Try the Generator
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/about')} className="gap-2">
                      <Sparkles className="w-4 h-4" />
                      Learn More About Us
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/help')} className="gap-2">
                      <BookOpen className="w-4 h-4" />
                      Get Help
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-background/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-blue-600 rounded flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">LANDING PAGE GENERATOR</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Need more help? Visit our Help page for additional support.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Documentation;
