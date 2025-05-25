import { PageSection, ThemeConfig, UserFormData } from '../types';

export interface ShareableData {
  sections: PageSection[];
  theme: ThemeConfig;
  formData: Partial<UserFormData>;
  timestamp: number;
  version: string;
}

export interface ShareOptions {
  platform?: 'link' | 'email' | 'twitter' | 'linkedin' | 'facebook';
  includePreview?: boolean;
}

// Generate a unique share ID
export const generateShareId = (): string => {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
};

// Compress data for URL sharing
export const compressShareData = (data: ShareableData): string => {
  try {
    const jsonString = JSON.stringify(data);
    // Simple base64 encoding for now - in production, you'd want proper compression
    return btoa(encodeURIComponent(jsonString));
  } catch (error) {
    console.error('Error compressing share data:', error);
    throw new Error('Failed to compress share data');
  }
};

// Decompress data from URL
export const decompressShareData = (compressed: string): ShareableData => {
  try {
    const jsonString = decodeURIComponent(atob(compressed));
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error decompressing share data:', error);
    throw new Error('Failed to decompress share data');
  }
};

// Generate shareable URL
export const generateShareURL = (data: ShareableData): string => {
  const compressed = compressShareData(data);
  const baseUrl = window.location.origin;
  return `${baseUrl}/shared/${compressed}`;
};

// Copy to clipboard utility
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return result;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

// Generate social media share URLs
export const generateSocialShareURL = (
  shareUrl: string,
  platform: string,
  productName: string = 'My Landing Page'
): string => {
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`Check out my landing page for ${productName}!`);

  switch (platform) {
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;

    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

    case 'email':
      const subject = encodeURIComponent(`Check out my landing page: ${productName}`);
      const body = encodeURIComponent(`Hi!\n\nI wanted to share my new landing page with you: ${shareUrl}\n\nLet me know what you think!`);
      return `mailto:?subject=${subject}&body=${body}`;

    default:
      return shareUrl;
  }
};

// Generate preview data for social sharing
export const generatePreviewData = (data: ShareableData) => {
  const { sections, formData } = data;
  const heroSection = sections.find(s => s.type === 'hero');

  return {
    title: formData.productName || 'Landing Page',
    description: heroSection?.content?.subhead || 'Check out this amazing landing page!',
    image: heroSection?.content?.imageUrl || '/placeholder.svg',
    url: generateShareURL(data)
  };
};

// Save to localStorage for quick access
export const saveToLocalStorage = (data: ShareableData, key: string = 'shared-page'): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

// Load from localStorage
export const loadFromLocalStorage = (key: string = 'shared-page'): ShareableData | null => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

// Generate QR code URL using QR Server API
export const generateQRCodeDataURL = async (url: string): Promise<string> => {
  console.log('Generating QR code for URL:', url);

  try {
    // Using QR Server API (free service) - return URL directly
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&format=png&data=${encodeURIComponent(url)}`;
    console.log('QR API URL:', qrApiUrl);

    // Return the API URL directly - browsers can load this as an image source
    return qrApiUrl;

  } catch (error) {
    console.error('Error generating QR code:', error);

    // Fallback: Generate a better-looking placeholder SVG
    const fallbackSvg = `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <defs>
          <pattern id="qrPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="10" height="10" fill="#000"/>
            <rect x="10" y="10" width="10" height="10" fill="#000"/>
          </pattern>
        </defs>
        <rect width="200" height="200" fill="white" stroke="#ddd" stroke-width="2"/>
        <rect x="20" y="20" width="160" height="160" fill="url(#qrPattern)" opacity="0.3"/>
        <text x="100" y="100" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="10" fill="#666">
          QR Code
        </text>
        <text x="100" y="115" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="8" fill="#999">
          ${url.length > 30 ? url.substring(0, 30) + '...' : url}
        </text>
      </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(fallbackSvg)}`;
  }
};

// Validate share data
export const validateShareData = (data: any): data is ShareableData => {
  return (
    data &&
    typeof data === 'object' &&
    Array.isArray(data.sections) &&
    data.theme &&
    typeof data.theme === 'object' &&
    data.formData &&
    typeof data.formData === 'object' &&
    typeof data.timestamp === 'number' &&
    typeof data.version === 'string'
  );
};

// Create shareable data from current state
export const createShareableData = (
  sections: PageSection[],
  theme: ThemeConfig,
  formData: Partial<UserFormData>
): ShareableData => {
  return {
    sections,
    theme,
    formData,
    timestamp: Date.now(),
    version: '1.0.0'
  };
};

// Analytics tracking for shares (placeholder)
export const trackShare = (platform: string, shareId: string): void => {
  // In a real implementation, you'd send this to your analytics service
  console.log(`Share tracked: ${platform} - ${shareId}`);
};

export default {
  generateShareId,
  compressShareData,
  decompressShareData,
  generateShareURL,
  copyToClipboard,
  generateSocialShareURL,
  generatePreviewData,
  saveToLocalStorage,
  loadFromLocalStorage,
  generateQRCodeDataURL,
  validateShareData,
  createShareableData,
  trackShare
};
