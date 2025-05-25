import { PageSection, ThemeConfig, UserFormData } from '../types';

interface ExportOptions {
  sections: PageSection[];
  theme: ThemeConfig;
  formData: Partial<UserFormData>;
  includeStyles?: boolean;
  includeScripts?: boolean;
}

const generateCSS = (theme: ThemeConfig) => {
  const isDark = theme.mode === 'dark';
  
  return `
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: ${isDark ? '#ffffff' : '#1e293b'};
        background-color: ${isDark ? '#1e293b' : '#ffffff'};
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }
      
      .hero-section {
        background: ${isDark 
          ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)' 
          : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)'
        };
        padding: 5rem 1.5rem;
        text-align: center;
      }
      
      .hero-title {
        font-size: clamp(2.5rem, 5vw, 4rem);
        font-weight: 700;
        margin-bottom: 1.5rem;
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .hero-subtitle {
        font-size: 1.25rem;
        color: ${isDark ? '#cbd5e1' : '#64748b'};
        margin-bottom: 2rem;
        max-width: 42rem;
        margin-left: auto;
        margin-right: auto;
      }
      
      .btn-primary {
        background-color: ${theme.brandColor || '#3b82f6'};
        color: white;
        padding: 0.75rem 2rem;
        border: none;
        border-radius: 0.5rem;
        font-size: 1.125rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        text-decoration: none;
        display: inline-block;
      }
      
      .btn-primary:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }
      
      .section {
        padding: 4rem 1.5rem;
      }
      
      .section-title {
        font-size: 2.25rem;
        font-weight: 700;
        text-align: center;
        margin-bottom: 3rem;
      }
      
      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-top: 3rem;
      }
      
      .feature-card {
        background: ${isDark ? '#334155' : '#f8fafc'};
        padding: 2rem;
        border-radius: 0.75rem;
        text-align: center;
        border: 1px solid ${isDark ? '#475569' : '#e2e8f0'};
        transition: transform 0.2s, box-shadow 0.2s;
      }
      
      .feature-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      }
      
      .feature-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }
      
      .feature-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
      }
      
      .feature-description {
        color: ${isDark ? '#cbd5e1' : '#64748b'};
      }
      
      .testimonials-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 2rem;
        margin-top: 3rem;
      }
      
      .testimonial-card {
        background: ${isDark ? '#334155' : '#f8fafc'};
        padding: 2rem;
        border-radius: 0.75rem;
        border: 1px solid ${isDark ? '#475569' : '#e2e8f0'};
      }
      
      .testimonial-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      
      .testimonial-avatar {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        object-fit: cover;
      }
      
      .testimonial-name {
        font-weight: 600;
      }
      
      .testimonial-role {
        color: ${isDark ? '#cbd5e1' : '#64748b'};
        font-size: 0.875rem;
      }
      
      .testimonial-quote {
        font-style: italic;
        color: ${isDark ? '#cbd5e1' : '#64748b'};
        margin-top: 1rem;
      }
      
      .about-section {
        text-align: center;
      }
      
      .about-content {
        font-size: 1.125rem;
        color: ${isDark ? '#cbd5e1' : '#64748b'};
        max-width: 42rem;
        margin: 0 auto;
      }
      
      .custom-section {
        background: ${isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(248, 250, 252, 0.5)'};
        text-align: center;
      }
      
      .custom-content {
        font-size: 1.125rem;
        color: ${isDark ? '#cbd5e1' : '#64748b'};
        max-width: 42rem;
        margin: 0 auto;
      }
      
      @media (max-width: 768px) {
        .hero-section {
          padding: 3rem 1rem;
        }
        
        .section {
          padding: 3rem 1rem;
        }
        
        .features-grid {
          grid-template-columns: 1fr;
        }
        
        .testimonials-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
  `;
};

const generateSectionHTML = (section: PageSection): string => {
  switch (section.type) {
    case 'hero':
      return `
        <section class="hero-section">
          <div class="container">
            <h1 class="hero-title">${section.content.headline}</h1>
            <p class="hero-subtitle">${section.content.subhead}</p>
            <a href="#" class="btn-primary">Get Started</a>
          </div>
        </section>
      `;
      
    case 'about':
      return `
        <section class="section about-section">
          <div class="container">
            <h2 class="section-title">${section.content.title}</h2>
            <p class="about-content">${section.content.content}</p>
          </div>
        </section>
      `;
      
    case 'features':
      const featuresHTML = section.content.map((feature: any) => `
        <div class="feature-card">
          <div class="feature-icon">${getIconEmoji(feature.icon)}</div>
          <h3 class="feature-title">${feature.title}</h3>
          <p class="feature-description">${feature.description}</p>
        </div>
      `).join('');
      
      return `
        <section class="section">
          <div class="container">
            <h2 class="section-title">Features</h2>
            <div class="features-grid">
              ${featuresHTML}
            </div>
          </div>
        </section>
      `;
      
    case 'testimonials':
      const testimonialsHTML = section.content.map((testimonial: any) => `
        <div class="testimonial-card">
          <div class="testimonial-header">
            <img src="${testimonial.avatar}" alt="${testimonial.name}" class="testimonial-avatar">
            <div>
              <div class="testimonial-name">${testimonial.name}</div>
              <div class="testimonial-role">${testimonial.role} at ${testimonial.company}</div>
            </div>
          </div>
          <p class="testimonial-quote">"${testimonial.quote}"</p>
        </div>
      `).join('');
      
      return `
        <section class="section">
          <div class="container">
            <h2 class="section-title">What Our Customers Say</h2>
            <div class="testimonials-grid">
              ${testimonialsHTML}
            </div>
          </div>
        </section>
      `;
      
    case 'custom':
      return `
        <section class="section custom-section">
          <div class="container">
            <h2 class="section-title">${section.content.title}</h2>
            <p class="custom-content">${section.content.content}</p>
          </div>
        </section>
      `;
      
    default:
      return '';
  }
};

const getIconEmoji = (iconName: string): string => {
  const iconMap: { [key: string]: string } = {
    Zap: '⚡',
    Shield: '🛡️',
    Rocket: '🚀',
    Star: '⭐',
    CheckCircle: '✅',
  };
  return iconMap[iconName] || '✅';
};

export const exportToHTML = (options: ExportOptions): string => {
  const { sections, theme, formData } = options;
  const visibleSections = sections.filter(section => section.isVisible);
  
  const sectionsHTML = visibleSections
    .sort((a, b) => a.order - b.order)
    .map(section => generateSectionHTML(section))
    .join('\n');
  
  const css = generateCSS(theme);
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formData.productName || 'Landing Page'}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    ${css}
</head>
<body>
    ${sectionsHTML}
    
    <script>
      // Add smooth scrolling for anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    </script>
</body>
</html>
  `.trim();
};

export const downloadHTML = (html: string, filename: string = 'landing-page.html') => {
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
