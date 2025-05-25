import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Sparkles,
  ArrowLeft,
  HelpCircle,
  Search,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { submitContactForm, validateContactForm } from '../lib/contactStorage';

export const Help = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const faqs = [
    {
      id: 'what-is-generator',
      question: 'What is the LANDING PAGE GENERATOR?',
      answer: 'The LANDING PAGE GENERATOR is an AI-powered tool that creates professional landing pages based on your product description. Simply provide details about your product, and our AI will generate a complete landing page with content, design, and layout.',
      category: 'General'
    },
    {
      id: 'how-long-generation',
      question: 'How long does it take to generate a landing page?',
      answer: 'Page generation typically takes 10-30 seconds, depending on the complexity of your requirements and current server load. The AI needs time to analyze your input and create customized content.',
      category: 'Generation'
    },
    {
      id: 'can-customize',
      question: 'Can I customize the generated landing page?',
      answer: 'Yes! After generation, you can use our editor panel to customize colors, themes, content, and layout. You can also add or remove sections, edit text, and adjust the overall design to match your brand.',
      category: 'Customization'
    },
    {
      id: 'export-options',
      question: 'What export options are available?',
      answer: 'You can export your landing page as a standalone HTML file for self-hosting, or generate a shareable link that others can view instantly. Both options create fully responsive, SEO-optimized pages.',
      category: 'Export'
    },
    {
      id: 'is-free',
      question: 'Is the service free to use?',
      answer: 'Yes, the basic landing page generation is completely free. You can create, customize, and export landing pages without any cost. Premium features may be added in the future.',
      category: 'Pricing'
    },
    {
      id: 'mobile-responsive',
      question: 'Are the generated pages mobile-responsive?',
      answer: 'Absolutely! All generated landing pages are fully responsive and optimized for desktop, tablet, and mobile devices. The design automatically adapts to different screen sizes.',
      category: 'Technical'
    },
    {
      id: 'seo-optimized',
      question: 'Are the pages SEO-optimized?',
      answer: 'Yes, all generated pages include proper HTML structure, meta tags, semantic markup, and other SEO best practices to help your page rank well in search engines.',
      category: 'Technical'
    },
    {
      id: 'data-privacy',
      question: 'How is my data handled?',
      answer: 'We take privacy seriously. Your product information is used only to generate your landing page and is not stored permanently or shared with third parties. Generated pages are temporarily cached for sharing purposes only.',
      category: 'Privacy'
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);

    // Validate form data before submission
    const validation = validateContactForm(contactForm);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      toast.error('Please fix the form errors before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for Netlify Forms
      const formData = new FormData();
      formData.append('form-name', 'help-contact');
      formData.append('name', contactForm.name);
      formData.append('email', contactForm.email);
      formData.append('subject', contactForm.subject);
      formData.append('message', contactForm.message);

      // Submit to Netlify
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString()
      });

      if (response.ok) {
        toast.success('Message sent successfully! We\'ll get back to you soon.');
        setContactForm({ name: '', email: '', subject: '', message: '' });
        setFormErrors([]);

        // Redirect to thank you page after a short delay
        setTimeout(() => {
          window.location.href = '/thank-you.html';
        }, 1500);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-blue-50 dark:from-primary/10 dark:via-background dark:to-blue-950/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Help Center</span>
            </div>
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent">
            How can we help you?
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Find answers to your questions or get in touch with our support team
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Quick Links Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/docs')}>
                  📚 Documentation
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/about')}>
                  ℹ️ About Us
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/generator')}>
                  🚀 Try Generator
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  {searchQuery ? `Found ${filteredFaqs.length} results for "${searchQuery}"` : 'Common questions and answers'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{faq.category}</Badge>
                          {faq.question}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {filteredFaqs.length === 0 && (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                    <Button variant="outline" onClick={() => setSearchQuery('')} className="mt-2">
                      Clear Search
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Still need help?</CardTitle>
                <CardDescription>Send us a message and we'll get back to you</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Form Errors */}
                {formErrors.length > 0 && (
                  <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-destructive" />
                      <span className="text-sm font-medium text-destructive">Please fix the following errors:</span>
                    </div>
                    <ul className="text-sm text-destructive space-y-1">
                      {formErrors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <form
                  name="help-contact"
                  data-netlify="true"
                  data-netlify-honeypot="bot-field"
                  onSubmit={handleContactSubmit}
                  className="space-y-4"
                >
                  {/* Netlify Forms requires this hidden input */}
                  <input type="hidden" name="form-name" value="help-contact" />

                  {/* Honeypot field for spam protection */}
                  <div style={{ display: 'none' }}>
                    <label>
                      Don't fill this out if you're human: <input name="bot-field" />
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="text-sm font-medium block mb-2">Name</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="text-sm font-medium block mb-2">Email</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="text-sm font-medium block mb-2">Subject</label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter subject"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="text-sm font-medium block mb-2">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      rows={4}
                      required
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Describe how we can help you..."
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-blue-600 rounded flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">LANDING PAGE GENERATOR</span>
            </div>
            <div className="text-sm text-muted-foreground">
              We're here to help! Response time: Usually within 24 hours
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Help;
