import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Sparkles, ArrowLeft, Save, Share2, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../stores/useStore';
import { toast } from 'sonner';
import { ShareDialog } from './ShareDialog';
import { downloadHTML } from '../lib/htmlExporter';

interface DashboardHeaderProps {
  title?: string;
  showBackButton?: boolean;
  showActions?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title = 'LANDING PAGE GENERATOR',
  showBackButton = false,
  showActions = false
}) => {
  const navigate = useNavigate();
  const { generatedContent, exportToHTML, formData } = useStore();
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);

  const handleSave = () => {
    // In a real app, this would save to a backend
    toast.success('Page saved successfully!');
  };

  const handleShare = () => {
    setShareDialogOpen(true);
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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-blue-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold">{title}</span>
          </div>
        </div>

        {/* Center Section - Status */}
        {generatedContent && (
          <div className="hidden md:flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              Page Generated
            </Badge>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {showActions && generatedContent && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="hidden sm:flex gap-2"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="hidden sm:flex gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </>
          )}

          <ThemeToggle />
        </div>
      </div>

      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />
    </header>
  );
};

export default DashboardHeader;
