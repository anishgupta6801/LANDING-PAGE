import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  ExternalLink,
  AlertCircle,
  Sparkles,
  Download,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';
import {
  decompressShareData,
  validateShareData,
  copyToClipboard,
  ShareableData
} from '../lib/shareUtils';
import { exportToHTML, downloadHTML } from '../lib/htmlExporter';

// Import the section renderer from LivePreview
const getIconComponent = (iconName: string) => {
  const icons: { [key: string]: React.ComponentType<{ className?: string }> } = {
    Zap: ({ className }) => <div className={`${className} text-yellow-500`}>⚡</div>,
    Shield: ({ className }) => <div className={`${className} text-blue-500`}>🛡️</div>,
    Rocket: ({ className }) => <div className={`${className} text-purple-500`}>🚀</div>,
    Star: ({ className }) => <div className={`${className} text-orange-500`}>⭐</div>,
    CheckCircle: ({ className }) => <div className={`${className} text-green-500`}>✅</div>,
  };
  return icons[iconName] || icons.CheckCircle;
};

const SectionRenderer = ({ section, theme }: { section: any; theme: any }) => {

  switch (section.type) {
    case 'hero':
      return (
        <div className="relative bg-gradient-to-br from-primary/10 to-blue-100 dark:from-primary/20 dark:to-blue-900/20 py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {section.content.headline}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {section.content.subhead}
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </div>
        </div>
      );

    case 'about':
      return (
        <div className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">{section.content.title}</h2>
            <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
              {section.content.content}
            </p>
          </div>
        </div>
      );

    case 'features':
      return (
        <div className="py-16 px-6 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.content.map((feature: any) => {
                const IconComponent = getIconComponent(feature.icon);
                return (
                  <Card key={feature.id} className="p-6 text-center hover:shadow-lg transition-shadow">
                    <div className="mb-4 flex justify-center">
                      <IconComponent className="w-12 h-12" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      );

    case 'testimonials':
      return (
        <div className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {section.content.map((testimonial: any) => (
                <Card key={testimonial.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-muted-foreground mb-4">"{testimonial.quote}"</p>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role} at {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      );

    case 'custom':
      return (
        <div className="py-16 px-6 bg-muted/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">{section.content.title}</h2>
            <p className="text-lg text-muted-foreground">{section.content.content}</p>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export const SharedPage = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const navigate = useNavigate();
  const [shareData, setShareData] = useState<ShareableData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (shareId) {
      loadSharedPage(shareId);
    }
  }, [shareId]);

  const loadSharedPage = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const data = decompressShareData(id);

      if (!validateShareData(data)) {
        throw new Error('Invalid share data');
      }

      setShareData(data);
    } catch (err) {
      console.error('Error loading shared page:', err);
      setError('Failed to load shared page. The link may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      toast.success('Link copied to clipboard!');
    } else {
      toast.error('Failed to copy link');
    }
  };

  const handleExportHTML = () => {
    if (!shareData) return;

    try {
      const html = exportToHTML({
        sections: shareData.sections,
        theme: shareData.theme,
        formData: shareData.formData,
        includeStyles: true,
        includeScripts: true
      });

      const filename = `${shareData.formData.productName || 'shared-landing-page'}.html`;
      downloadHTML(html, filename);
      toast.success('HTML file downloaded successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export HTML file');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <p className="text-lg font-medium">Loading shared page...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Page Not Found
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={() => navigate('/')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!shareData) return null;

  const visibleSections = shareData.sections
    .filter(section => section.isVisible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-semibold">{shareData.formData.productName || 'Shared Landing Page'}</span>
              <Badge variant="secondary" className="ml-2 text-xs">Shared</Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyLink}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportHTML}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Create Your Own
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="bg-background">
        <div className={shareData.theme.mode === 'dark' ? 'dark' : ''}>
          {visibleSections.map((section) => (
            <SectionRenderer
              key={section.id}
              section={section}
              theme={shareData.theme}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default SharedPage;
