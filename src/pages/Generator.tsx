
import React from 'react';
import { useStore } from '../stores/useStore';
import { MultiStepForm } from '../components/MultiStepForm';
import { LivePreview } from '../components/LivePreview';
import { EditorPanel } from '../components/EditorPanel';
import { DashboardHeader } from '../components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Edit3, Eye } from 'lucide-react';

export const Generator = () => {
  const { generatedContent } = useStore();

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Dashboard Header */}
      <DashboardHeader
        title="Page Generator"
        showBackButton={true}
        showActions={!!generatedContent}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Form or Editor */}
        <div className="w-1/3 border-r bg-card/50 overflow-auto">
          {!generatedContent ? (
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Create Your Page</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Tell us about your product and we'll generate a beautiful landing page for you.
                </p>
              </div>
              <MultiStepForm />
            </div>
          ) : (
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Edit3 className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Page Editor</h2>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    Generated
                  </Badge>
                  <Badge variant="outline">Ready to customize</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your landing page has been generated! Use the preview panel to see your page and customize it using the controls.
                </p>
              </div>

              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground">
                    • Use the preview panel to see your changes
                    • Drag sections to reorder them
                    • Use the editor panel to customize themes and content
                  </p>
                </CardContent>
              </Card>

              <MultiStepForm />
            </div>
          )}
        </div>

        {/* Center Panel - Preview */}
        <div className="flex-1 bg-muted/20">
          <LivePreview />
        </div>

        {/* Right Panel - Editor Controls */}
        {generatedContent && <EditorPanel />}
      </div>
    </div>
  );
};
