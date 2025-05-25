// Netlify Forms submission utility
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface FormSubmissionResult {
  success: boolean;
  message: string;
  error?: string;
}

// Check if we're running in production (deployed on Netlify)
const isProduction = () => {
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  return hostname !== 'localhost' && 
         hostname !== '127.0.0.1' && 
         hostname !== '0.0.0.0' &&
         !hostname.includes('localhost');
};

// Submit form to Netlify Forms
export const submitToNetlifyForms = async (
  formData: ContactFormData,
  formName: string = 'help-contact'
): Promise<FormSubmissionResult> => {
  try {
    if (!isProduction()) {
      // Development mode - simulate submission
      console.log('🔧 Development mode: Simulating Netlify form submission');
      console.log('Form data:', formData);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Message sent successfully! (Development mode - form would be submitted to Netlify in production)'
      };
    }

    // Production mode - actual Netlify submission
    console.log('🚀 Production mode: Submitting to Netlify Forms');
    
    // Create form data in the format Netlify expects
    const params = new URLSearchParams();
    params.append('form-name', formName);
    params.append('name', formData.name);
    params.append('email', formData.email);
    params.append('subject', formData.subject);
    params.append('message', formData.message);

    console.log('📤 Submitting form data:', params.toString());

    const response = await fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      console.log('✅ Form submitted successfully to Netlify');
      return {
        success: true,
        message: 'Message sent successfully! We\'ll get back to you soon.'
      };
    } else {
      const responseText = await response.text();
      console.error('❌ Form submission failed:', response.status, responseText);
      
      return {
        success: false,
        message: 'Failed to send message. Please try again.',
        error: `HTTP ${response.status}: ${responseText}`
      };
    }

  } catch (error) {
    console.error('❌ Form submission error:', error);
    
    return {
      success: false,
      message: 'Failed to send message. Please check your connection and try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Alternative submission method using fetch with different approach
export const submitToNetlifyFormsAlt = async (
  formData: ContactFormData,
  formName: string = 'help-contact'
): Promise<FormSubmissionResult> => {
  try {
    if (!isProduction()) {
      return submitToNetlifyForms(formData, formName);
    }

    // Alternative method: Submit as FormData
    const form = new FormData();
    form.append('form-name', formName);
    form.append('name', formData.name);
    form.append('email', formData.email);
    form.append('subject', formData.subject);
    form.append('message', formData.message);

    const response = await fetch('/', {
      method: 'POST',
      body: form
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Message sent successfully! We\'ll get back to you soon.'
      };
    } else {
      const responseText = await response.text();
      return {
        success: false,
        message: 'Failed to send message. Please try again.',
        error: `HTTP ${response.status}: ${responseText}`
      };
    }

  } catch (error) {
    return {
      success: false,
      message: 'Failed to send message. Please check your connection and try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Validate form data
export const validateFormData = (data: ContactFormData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.name.trim()) {
    errors.push('Name is required');
  }

  if (!data.email.trim()) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Please enter a valid email address');
  }

  if (!data.subject.trim()) {
    errors.push('Subject is required');
  }

  if (!data.message.trim()) {
    errors.push('Message is required');
  } else if (data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
