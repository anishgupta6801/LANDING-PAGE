import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Copy,
  Share2,
  Mail,
  MessageCircle,
  Linkedin,
  Facebook,
  ExternalLink,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '../stores/useStore';
import {
  createShareableData,
  generateShareURL,
  copyToClipboard,
  generateSocialShareURL,
  trackShare,
  generateShareId
} from '../lib/shareUtils';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({ open, onOpenChange }) => {
  const { sections, theme, formData } = useStore();
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && sections.length > 0) {
      generateShare();
    }
  }, [open, sections, theme, formData]);

  const generateShare = async () => {
    setLoading(true);
    try {
      const shareableData = createShareableData(sections, theme, formData);
      const url = generateShareURL(shareableData);
      setShareUrl(url);
    } catch (error) {
      console.error('Error generating share:', error);
      toast.error('Failed to generate share link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      toast.success('Link copied to clipboard!');
      trackShare('clipboard', generateShareId());
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy link');
    }
  };

  const handleSocialShare = (platform: string) => {
    const socialUrl = generateSocialShareURL(
      shareUrl,
      platform,
      formData.productName || 'My Landing Page'
    );
    window.open(socialUrl, '_blank', 'width=600,height=400');
    trackShare(platform, generateShareId());
  };

  const handlePreviewShare = () => {
    window.open(shareUrl, '_blank');
    trackShare('preview', generateShareId());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Your Landing Page
          </DialogTitle>
          <DialogDescription>
            Share your landing page with others using the link below or social media.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Link</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="share-url">Share Link</Label>
              <div className="flex gap-2">
                <Input
                  id="share-url"
                  value={shareUrl}
                  readOnly
                  placeholder={loading ? "Generating link..." : "Share link will appear here"}
                />
                <Button
                  size="sm"
                  onClick={handleCopyLink}
                  disabled={!shareUrl || loading}
                  className="shrink-0"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePreviewShare}
                disabled={!shareUrl || loading}
                className="flex-1"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              <p>• Link includes your page design, content, and theme</p>
              <p>• Recipients can view but not edit your page</p>
              <p>• Link expires after 30 days of inactivity</p>
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleSocialShare('twitter')}
                disabled={!shareUrl || loading}
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Twitter
              </Button>

              <Button
                variant="outline"
                onClick={() => handleSocialShare('linkedin')}
                disabled={!shareUrl || loading}
                className="flex items-center gap-2"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>

              <Button
                variant="outline"
                onClick={() => handleSocialShare('facebook')}
                disabled={!shareUrl || loading}
                className="flex items-center gap-2"
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </Button>

              <Button
                variant="outline"
                onClick={() => handleSocialShare('email')}
                disabled={!shareUrl || loading}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Email
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              <p>Share your landing page on social media to get feedback and drive traffic.</p>
            </div>
          </TabsContent>


        </Tabs>

        <div className="flex items-center gap-2 pt-4 border-t">
          <Badge variant="secondary" className="text-xs">
            {formData.productName || 'Landing Page'}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {sections.filter(s => s.isVisible).length} sections
          </Badge>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
