
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
import { ShareDialog } from './ShareDialog';
import { downloadHTML } from '../lib/htmlExporter';

const ColorPreview: React.FC<{ color: string }> = ({ color }) => (
  <div
    className="w-4 h-4 rounded-full border border-border"
    style={{ backgroundColor: color }}
  />
);

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
    isGenerating,
    exportToHTML,
    formData
  } = useStore();

  const [customSectionDescription, setCustomSectionDescription] = React.useState('');
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);

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
    try {
      const html = exportToHTML();
      const filename = `${formData.productName || 'landing-page'}.html`;
      downloadHTML(html, filename);
      toast.success('HTML file downloaded successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export HTML file');
    }
  };

  const handleShare = () => {
    setShareDialogOpen(true);
  };

  return (
    <div className="w-80 border-l bg-card/50 p-6 overflow-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Customize</h2>
        <p className="text-sm text-muted-foreground">
          Adjust your page theme, colors, and content to match your brand.
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Controls */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="w-4 h-4" />
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
                      <ColorPreview color={preset.primary} />
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
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Plus className="w-4 h-4" />
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

      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />
    </div>
  );
};
