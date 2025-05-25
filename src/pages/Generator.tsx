
import React from 'react';
import { useStore } from '../stores/useStore';
import { MultiStepForm } from '../components/MultiStepForm';
import { LivePreview } from '../components/LivePreview';
import { EditorPanel } from '../components/EditorPanel';

export const Generator = () => {
  const { generatedContent } = useStore();

  return (
    <div className="h-screen flex">
      {/* Left Panel - Form or Editor */}
      <div className="w-1/3 border-r bg-background overflow-auto">
        {!generatedContent ? (
          <MultiStepForm />
        ) : (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Page Editor</h2>
            <p className="text-muted-foreground mb-6">
              Your landing page has been generated! Use the preview panel to see your page and the editor panel to customize it.
            </p>
            <MultiStepForm />
          </div>
        )}
      </div>

      {/* Center Panel - Preview */}
      <div className="flex-1 bg-muted/30">
        <LivePreview />
      </div>

      {/* Right Panel - Editor Controls */}
      {generatedContent && <EditorPanel />}
    </div>
  );
};
