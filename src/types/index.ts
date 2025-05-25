
export interface UserFormData {
  productName: string;
  industry: string;
  tone: 'professional' | 'friendly' | 'bold' | 'minimalist';
  keyFeatures: string[];
  brandColor: string;
  targetAudience: string;
  uniqueValue: string;
}

export interface GeneratedContent {
  hero: {
    headline: string;
    subhead: string;
    imageUrl: string;
  };
  about: {
    title: string;
    content: string;
  };
  features: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
  }>;
  testimonials: Array<{
    id: string;
    name: string;
    role: string;
    company: string;
    quote: string;
    avatar: string;
  }>;
}

export interface PageSection {
  id: string;
  type: 'hero' | 'about' | 'features' | 'testimonials' | 'custom';
  title: string;
  order: number;
  content: any;
  isVisible: boolean;
}

export interface ThemeConfig {
  mode: 'light' | 'dark';
  brandColor: string;
  preset: 'default' | 'ocean' | 'sunset';
}
