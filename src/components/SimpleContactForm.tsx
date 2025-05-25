import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const SimpleContactForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    toast.success('Submitting your message...');

    // Let the form submit naturally to Netlify
    // The form will handle the submission and redirect
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Still need help?</CardTitle>
        <CardDescription>Send us a message and we'll get back to you</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Simple HTML form that works with Netlify */}
        <form
          name="help-contact"
          method="POST"
          action="/thank-you.html"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Hidden fields for Netlify */}
          <input type="hidden" name="form-name" value="help-contact" />

          {/* Honeypot field for spam protection */}
          <div className="hidden">
            <label>
              Don't fill this out if you're human:
              <input name="bot-field" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium block mb-2">
                Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-medium block mb-2">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="text-sm font-medium block mb-2">
              Subject *
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="How can we help?"
            />
          </div>

          <div>
            <label htmlFor="message" className="text-sm font-medium block mb-2">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Please describe your question or issue in detail..."
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium">Response Time:</p>
              <p className="mt-1 text-xs">
                We typically respond to all inquiries within 24 hours. All fields marked with * are required.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleContactForm;
