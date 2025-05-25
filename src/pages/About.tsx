import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  Sparkles,
  ArrowLeft,
  Zap,
  Users,
  Target,
  Heart,
  Code,
  Palette,
  Rocket
} from 'lucide-react';

export const About = () => {
  const navigate = useNavigate();

  const teamValues = [
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We leverage cutting-edge AI technology to make web development accessible to everyone.'
    },
    {
      icon: Users,
      title: 'User-Centric',
      description: 'Every feature is designed with our users in mind, prioritizing simplicity and effectiveness.'
    },
    {
      icon: Target,
      title: 'Quality',
      description: 'We maintain high standards in code quality, design, and user experience.'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'We are passionate about democratizing web development and empowering creators.'
    }
  ];

  const techStack = [
    { name: 'React', description: 'Modern UI framework' },
    { name: 'TypeScript', description: 'Type-safe development' },
    { name: 'Tailwind CSS', description: 'Utility-first styling' },
    { name: 'Vite', description: 'Fast build tool' },
    { name: 'AI/ML', description: 'Content generation' }
  ];

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
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">About Us</span>
            </div>
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent">
            About LANDING PAGE GENERATOR
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're on a mission to democratize web development by making it possible for anyone to create beautiful, professional landing pages using the power of AI.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe that everyone should have the ability to create a professional web presence,
                regardless of their technical background. Our AI-powered landing page generator removes
                the barriers between great ideas and beautiful websites, enabling creators, entrepreneurs,
                and businesses to focus on what they do best while we handle the technical complexity.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamValues.map((value, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{value.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Technology Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30 rounded-3xl mx-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Built with Modern Technology</h2>
          <p className="text-xl text-muted-foreground">
            We use the latest tools and frameworks to deliver the best experience
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {techStack.map((tech, index) => (
            <Card key={index} className="text-center p-4">
              <CardContent className="p-0">
                <div className="font-semibold text-sm mb-1">{tech.name}</div>
                <div className="text-xs text-muted-foreground">{tech.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
            <div className="text-muted-foreground">Landing Pages Created</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">5,000+</div>
            <div className="text-muted-foreground">Happy Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
            <div className="text-muted-foreground">Uptime</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Your Landing Page?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of creators who trust our AI to build their web presence
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/generator')}
            className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
          >
            Get Started for Free
            <Rocket className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

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
              Built with ❤️ using React, Tailwind CSS, and AI
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
