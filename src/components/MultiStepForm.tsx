
import React from 'react';
import { useStore } from '../stores/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

const steps = [
  {
    title: 'Product Basics',
    description: 'Tell us about your product or startup'
  },
  {
    title: 'Brand & Tone',
    description: 'Define your brand personality'
  },
  {
    title: 'Features & Value',
    description: 'Highlight what makes you unique'
  },
  {
    title: 'Generate',
    description: 'Create your landing page'
  }
];

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce',
  'Marketing', 'Real Estate', 'Food & Beverage', 'Travel', 'Other'
];

const tones = [
  { value: 'professional', label: 'Professional', description: 'Formal and business-focused' },
  { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
  { value: 'bold', label: 'Bold', description: 'Confident and attention-grabbing' },
  { value: 'minimalist', label: 'Minimalist', description: 'Clean and simple' }
];

export const MultiStepForm = () => {
  const { 
    currentStep, 
    formData, 
    isGenerating,
    setCurrentStep, 
    updateFormData, 
    generateContent 
  } = useStore();

  const [features, setFeatures] = React.useState<string[]>(formData.keyFeatures || []);
  const [currentFeature, setCurrentFeature] = React.useState('');

  const isStepValid = (step: number) => {
    switch (step) {
      case 0:
        return formData.productName && formData.industry;
      case 1:
        return formData.tone && formData.brandColor;
      case 2:
        return formData.targetAudience && formData.uniqueValue && features.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      if (currentStep === 2) {
        updateFormData({ keyFeatures: features });
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addFeature = () => {
    if (currentFeature.trim() && features.length < 5) {
      setFeatures([...features, currentFeature.trim()]);
      setCurrentFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    updateFormData({ keyFeatures: features });
    await generateContent();
    setCurrentStep(currentStep + 1);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                index <= currentStep 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-px mx-2 transition-colors ${
                  index < currentStep ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold">{steps[currentStep]?.title}</h2>
        <p className="text-muted-foreground">{steps[currentStep]?.description}</p>
      </div>

      <Card>
        <CardContent className="p-6">
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="productName">Product/Startup Name *</Label>
                <Input
                  id="productName"
                  value={formData.productName || ''}
                  onChange={(e) => updateFormData({ productName: e.target.value })}
                  placeholder="Enter your product or company name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Select
                  value={formData.industry || ''}
                  onValueChange={(value) => updateFormData({ industry: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Brand Tone *</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tones.map((tone) => (
                    <div
                      key={tone.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors hover:border-primary ${
                        formData.tone === tone.value ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      onClick={() => updateFormData({ tone: tone.value as any })}
                    >
                      <div className="font-medium">{tone.label}</div>
                      <div className="text-sm text-muted-foreground">{tone.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brandColor">Brand Color *</Label>
                <div className="flex gap-3">
                  <Input
                    type="color"
                    value={formData.brandColor || '#3B82F6'}
                    onChange={(e) => updateFormData({ brandColor: e.target.value })}
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    value={formData.brandColor || '#3B82F6'}
                    onChange={(e) => updateFormData({ brandColor: e.target.value })}
                    placeholder="#3B82F6"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience *</Label>
                <Input
                  id="targetAudience"
                  value={formData.targetAudience || ''}
                  onChange={(e) => updateFormData({ targetAudience: e.target.value })}
                  placeholder="Who is your product for?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="uniqueValue">Unique Value Proposition *</Label>
                <Textarea
                  id="uniqueValue"
                  value={formData.uniqueValue || ''}
                  onChange={(e) => updateFormData({ uniqueValue: e.target.value })}
                  placeholder="What makes your product unique?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Key Features * (Add up to 5)</Label>
                <div className="flex gap-2">
                  <Input
                    value={currentFeature}
                    onChange={(e) => setCurrentFeature(e.target.value)}
                    placeholder="Enter a key feature"
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                  />
                  <Button onClick={addFeature} disabled={!currentFeature.trim() || features.length >= 5}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeFeature(index)}>
                      {feature} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Ready to Generate!</h3>
                <p className="text-muted-foreground">
                  We'll create a beautiful landing page based on your information.
                </p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-left space-y-2 text-sm">
                <div><strong>Product:</strong> {formData.productName}</div>
                <div><strong>Industry:</strong> {formData.industry}</div>
                <div><strong>Tone:</strong> {formData.tone}</div>
                <div><strong>Features:</strong> {features.join(', ')}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button
            onClick={handleNext}
            disabled={!isStepValid(currentStep)}
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleGenerate}
            disabled={!isStepValid(currentStep) || isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Page'}
            <Sparkles className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};
