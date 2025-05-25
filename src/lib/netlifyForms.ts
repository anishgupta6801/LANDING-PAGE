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

// Check if we can attempt real form submission
const canSubmitToNetlify = () => {
  // Always try real submission, even in development
  // This allows testing the actual Netlify integration
  return true;
};

// Submit form to Netlify Forms
export const submitToNetlifyForms = async (
  formData: ContactFormData,
  formName: string = 'help-contact'
): Promise<FormSubmissionResult> => {
  try {
    // Always attempt real submission to Netlify
    console.log('🚀 Attempting to submit to Netlify Forms');
    console.log('Environment:', isProduction() ? 'Production' : 'Development');
    console.log('Form data:', formData);

    // Create form data in the format Netlify expects
    const params = new URLSearchParams();
    params.append('form-name', formName);
    params.append('name', formData.name);
    params.append('email', formData.email);
    params.append('subject', formData.subject);
    params.append('message', formData.message);

    console.log('📤 Submitting form data:', params.toString());

    // Try multiple submission endpoints
    let response;
    const endpoints = ['/', '/forms/help-contact', window.location.pathname];

    for (const endpoint of endpoints) {
      try {
        console.log(`📡 Trying endpoint: ${endpoint}`);
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString()
        });

        console.log(`📥 Response from ${endpoint}:`, response.status);

        // If we get a successful response, break out of the loop
        if (response.ok) {
          break;
        }

        // If we get a 404, try the next endpoint
        if (response.status === 404) {
          console.log(`❌ 404 from ${endpoint}, trying next endpoint...`);
          continue;
        }

        // For other errors, break and handle below
        break;

      } catch (error) {
        console.log(`❌ Error with endpoint ${endpoint}:`, error);
        if (endpoint === endpoints[endpoints.length - 1]) {
          throw error; // Re-throw if this was the last endpoint
        }
      }
    }

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

      let errorMessage = 'Failed to send message. Please try again.';

      if (response.status === 404) {
        errorMessage = 'Form not found. This usually means Netlify Forms is not properly configured. Please check the deployment.';
        console.error('🔧 404 Error - Possible causes:');
        console.error('   1. Form not detected during build');
        console.error('   2. Netlify Forms not enabled');
        console.error('   3. Form name mismatch');
        console.error('   4. Missing data-netlify attribute');
      } else if (response.status === 400) {
        errorMessage = 'Invalid form data. Please check all required fields.';
      } else if (response.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      return {
        success: false,
        message: errorMessage,
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

// Alternative submission method using FormData
export const submitToNetlifyFormsAlt = async (
  formData: ContactFormData,
  formName: string = 'help-contact'
): Promise<FormSubmissionResult> => {
  try {
    console.log('🔄 Trying alternative submission method with FormData');

    // Method 2: Submit as FormData (sometimes works better)
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

    console.log('📥 Alternative method response:', response.status);

    if (response.ok) {
      return {
        success: true,
        message: 'Message sent successfully! We\'ll get back to you soon.'
      };
    } else {
      const responseText = await response.text();
      console.error('❌ Alternative method failed:', responseText);
      return {
        success: false,
        message: 'Failed to send message. Please try again.',
        error: `HTTP ${response.status}: ${responseText}`
      };
    }

  } catch (error) {
    console.error('❌ Alternative method error:', error);
    return {
      success: false,
      message: 'Failed to send message. Please check your connection and try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Method 3: Direct HTML form submission simulation
export const submitViaDirectForm = async (
  formData: ContactFormData,
  formName: string = 'help-contact'
): Promise<FormSubmissionResult> => {
  try {
    console.log('🔄 Trying direct form submission method');

    // Create a temporary form element and submit it
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/';
    form.setAttribute('data-netlify', 'true');
    form.setAttribute('data-netlify-honeypot', 'bot-field');
    form.style.display = 'none';

    // Add form fields
    const fields = [
      { name: 'form-name', value: formName },
      { name: 'name', value: formData.name },
      { name: 'email', value: formData.email },
      { name: 'subject', value: formData.subject },
      { name: 'message', value: formData.message }
    ];

    fields.forEach(field => {
      const input = document.createElement('input');
      input.type = field.name === 'message' ? 'textarea' : 'text';
      input.name = field.name;
      input.value = field.value;
      form.appendChild(input);
    });

    // Add honeypot field
    const honeypot = document.createElement('input');
    honeypot.type = 'hidden';
    honeypot.name = 'bot-field';
    form.appendChild(honeypot);

    document.body.appendChild(form);

    // Submit the form
    form.submit();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(form);
    }, 1000);

    return {
      success: true,
      message: 'Message sent successfully! We\'ll get back to you soon.'
    };

  } catch (error) {
    console.error('❌ Direct form submission error:', error);
    return {
      success: false,
      message: 'Failed to send message. Please try again.',
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
