
import React from 'react';
import { useStore } from '../stores/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Plus, Download, Share2, Palette } from 'lucide-react';
import { toast } from 'sonner';

const colorPresets = [
  { name: 'Ocean', primary: '#0891B2', secondary: '#0E7490' },
  { name: 'Sunset', primary: '#EA580C', secondary: '#DC2626' },
  { name: 'Forest', primary: '#059669', secondary: '#047857' },
  { name: 'Purple', primary: '#7C3AED', secondary: '#5B21B6' },
];

export const EditorPanel = () => {
  const { 
    sections, 
    theme, 
    updateTheme, 
    updateSections, 
    addCustomSection,
    isGenerating 
  } = useStore();

  const [customSectionDescription, setCustomSectionDescription] = React.useState('');

  const handleAddCustomSection = async () => {
    if (!customSectionDescription.trim()) return;
    
    await addCustomSection(customSectionDescription);
    setCustomSectionDescription('');
    toast.success('Custom section added!');
  };

  const toggleSectionVisibility = (sectionId: string) => {
    const updatedSections = sections.map(section =>
      section.id === sectionId 
        ? { ...section, isVisible: !section.isVisible }
        : section
    );
    updateSections(updatedSections);
  };

  const handleExport = () => {
    toast.success('Export functionality would be implemented here');
  };

  const handleShare = () => {
    toast.success('Share functionality would be implemented here');
  };

  return (
    <div className="w-80 border-l bg-background p-6 overflow-auto">
      <div className="space-y-6">
        {/* Theme Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Theme Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <Switch
                id="dark-mode"
                checked={theme.mode === 'dark'}
                onCheckedChange={(checked) => 
                  updateTheme({ mode: checked ? 'dark' : 'light' })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Brand Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={theme.brandColor}
                  onChange={(e) => updateTheme({ brandColor: e.target.value })}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={theme.brandColor}
                  onChange={(e) => updateTheme({ brandColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color Presets</Label>
              <div className="grid grid-cols-2 gap-2">
                {colorPresets.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    className="h-auto p-2"
                    onClick={() => updateTheme({ brandColor: preset.primary })}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <span className="text-xs">{preset.name}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section Management */}
        <Card>
          <CardHeader>
            <CardTitle>Page Sections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sections.map((section) => (
              <div key={section.id} className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm font-medium">{section.title}</span>
                <Switch
                  checked={section.isVisible}
                  onCheckedChange={() => toggleSectionVisibility(section.id)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Add Custom Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Section
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Describe the section you want to add..."
              value={customSectionDescription}
              onChange={(e) => setCustomSectionDescription(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSection()}
            />
            <Button 
              onClick={handleAddCustomSection}
              disabled={!customSectionDescription.trim() || isGenerating}
              className="w-full"
            >
              {isGenerating ? 'Generating...' : 'Add Section'}
            </Button>
          </CardContent>
        </Card>

        <Separator />

        {/* Export Actions */}
        <div className="space-y-3">
          <Button onClick={handleExport} variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Export HTML
          </Button>
          
          <Button onClick={handleShare} className="w-full">
            <Share2 className="w-4 h-4 mr-2" />
            Share Page
          </Button>
        </div>
      </div>
    </div>
  );
};
