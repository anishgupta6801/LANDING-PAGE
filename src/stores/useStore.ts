
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserFormData, GeneratedContent, PageSection, ThemeConfig } from '../types';
import { exportToHTML } from '../lib/htmlExporter';
import { createShareableData } from '../lib/shareUtils';


interface AppState {
  // Form state
  currentStep: number;
  formData: Partial<UserFormData>;
  isGenerating: boolean;

  // Content state
  generatedContent: GeneratedContent | null;
  sections: PageSection[];

  // Theme state
  theme: ThemeConfig;

  // UI state
  previewMode: 'desktop' | 'tablet' | 'mobile';



  // Actions
  setCurrentStep: (step: number) => void;
  updateFormData: (data: Partial<UserFormData>) => void;
  setIsGenerating: (generating: boolean) => void;
  setGeneratedContent: (content: GeneratedContent) => void;
  updateSections: (sections: PageSection[]) => void;
  updateTheme: (theme: Partial<ThemeConfig>) => void;
  setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  generateContent: () => Promise<void>;
  addCustomSection: (description: string) => Promise<void>;
  exportToHTML: () => string;
  generateShareData: () => any;


}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStep: 0,
      formData: {},
      isGenerating: false,
      generatedContent: null,
      sections: [],
      theme: {
        mode: 'light',
        brandColor: '#3B82F6',
        preset: 'default'
      },
      previewMode: 'desktop',

      // Actions
      setCurrentStep: (step) => set({ currentStep: step }),

      updateFormData: (data) => set((state) => ({
        formData: { ...state.formData, ...data }
      })),

      setIsGenerating: (generating) => set({ isGenerating: generating }),

      setGeneratedContent: (content) => {
        const sections: PageSection[] = [
          {
            id: 'hero',
            type: 'hero',
            title: 'Hero Section',
            order: 0,
            content: content.hero,
            isVisible: true
          },
          {
            id: 'about',
            type: 'about',
            title: 'About Section',
            order: 1,
            content: content.about,
            isVisible: true
          },
          {
            id: 'features',
            type: 'features',
            title: 'Features Section',
            order: 2,
            content: content.features,
            isVisible: true
          },
          {
            id: 'testimonials',
            type: 'testimonials',
            title: 'Testimonials Section',
            order: 3,
            content: content.testimonials,
            isVisible: true
          }
        ];

        set({
          generatedContent: content,
          sections: sections.sort((a, b) => a.order - b.order)
        });
      },

      updateSections: (sections) => set({ sections }),

      updateTheme: (themeUpdate) => set((state) => ({
        theme: { ...state.theme, ...themeUpdate }
      })),

      setPreviewMode: (mode) => set({ previewMode: mode }),

      generateContent: async () => {
        const { formData } = get();
        set({ isGenerating: true });

        // Simulate content generation delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
          // Generate template-based content
          const content: GeneratedContent = {
            hero: {
              headline: `Transform Your ${formData.industry || 'Business'} with ${formData.productName || 'Our Solution'}`,
              subhead: `${formData.tone === 'professional' ? 'Professional-grade' : formData.tone === 'friendly' ? 'User-friendly' : 'Cutting-edge'} tools designed for ${formData.targetAudience || 'modern businesses'}.`,
              imageUrl: `https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&crop=center`
            },
            about: {
              title: `About ${formData.productName || 'Our Company'}`,
              content: `We're revolutionizing the ${formData.industry || 'technology'} industry with innovative solutions. ${formData.uniqueValue || 'Our unique approach combines cutting-edge technology with user-centric design.'}`
            },
            features: formData.keyFeatures?.slice(0, 4).map((feature, index) => ({
              id: `feature-${index}`,
              title: feature,
              description: `Experience the power of ${feature.toLowerCase()} with our advanced platform.`,
              icon: ['Zap', 'Shield', 'Rocket', 'Star'][index] || 'CheckCircle'
            })) || [
              {
                id: 'feature-1',
                title: 'Lightning Fast',
                description: 'Built for speed and performance that scales with your business.',
                icon: 'Zap'
              },
              {
                id: 'feature-2',
                title: 'Secure & Reliable',
                description: 'Enterprise-grade security with 99.9% uptime guarantee.',
                icon: 'Shield'
              },
              {
                id: 'feature-3',
                title: 'Easy Integration',
                description: 'Seamlessly integrate with your existing tools and workflows.',
                icon: 'Rocket'
              }
            ],
            testimonials: [
              {
                id: 'testimonial-1',
                name: 'Sarah Chen',
                role: 'CEO',
                company: 'TechFlow Inc.',
                quote: `${formData.productName || 'This product'} has completely transformed how we operate. The results speak for themselves.`,
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b5b6e2fb?w=150&h=150&fit=crop&crop=face'
              },
              {
                id: 'testimonial-2',
                name: 'Marcus Rodriguez',
                role: 'Product Manager',
                company: 'Innovation Labs',
                quote: 'The best investment we\'ve made this year. Highly recommend to any growing business.',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
              }
            ]
          };

          get().setGeneratedContent(content);
          set({ isGenerating: false });
        } catch (error) {
          console.error('Content generation failed:', error);
          set({ isGenerating: false });
        }
      },

      addCustomSection: async (description) => {
        set({ isGenerating: true });

        // Simulate content generation
        await new Promise(resolve => setTimeout(resolve, 1000));

        const { sections } = get();
        const newSection: PageSection = {
          id: `custom-${Date.now()}`,
          type: 'custom',
          title: description,
          order: sections.length,
          content: {
            title: description,
            content: `This is a custom section: "${description}". You can edit this content to match your needs.`
          },
          isVisible: true
        };

        set({
          sections: [...sections, newSection],
          isGenerating: false
        });
      },

      exportToHTML: () => {
        const { sections, theme, formData } = get();
        return exportToHTML({
          sections,
          theme,
          formData,
          includeStyles: true,
          includeScripts: true
        });
      },

      generateShareData: () => {
        const { sections, theme, formData } = get();
        return createShareableData(sections, theme, formData);
      },


    }),
    {
      name: 'landing-page-generator',
      partialize: (state) => ({
        formData: state.formData,
        theme: state.theme,
        sections: state.sections,
        generatedContent: state.generatedContent
      })
    }
  )
);
