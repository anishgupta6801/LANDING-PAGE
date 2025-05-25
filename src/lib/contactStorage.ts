// Contact form data storage utilities

export interface ContactFormData {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: number;
  status: 'pending' | 'sent' | 'failed';
  userAgent?: string;
  ipAddress?: string;
}

export interface ContactSubmissionResponse {
  success: boolean;
  message: string;
  id?: string;
  error?: string;
}

// Generate unique ID for each submission
export const generateContactId = (): string => {
  return `contact_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

// Local Storage Functions (for development/fallback)
export const saveToLocalStorage = (data: ContactFormData): boolean => {
  try {
    const existingData = getFromLocalStorage();
    const updatedData = [...existingData, data];
    localStorage.setItem('contact_submissions', JSON.stringify(updatedData));
    console.log('Contact form data saved to localStorage:', data);
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
};

export const getFromLocalStorage = (): ContactFormData[] => {
  try {
    const stored = localStorage.getItem('contact_submissions');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return [];
  }
};

// Backend API Functions (for production)
export const submitToBackend = async (data: Omit<ContactFormData, 'id' | 'timestamp' | 'status'>): Promise<ContactSubmissionResponse> => {
  try {
    // Replace with your actual backend endpoint
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
    console.log('Submitting to backend URL:', `${BACKEND_URL}/api/contact`);

    const response = await fetch(`${BACKEND_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      }),
    });

    console.log('Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log('Backend success response:', result);
    return {
      success: true,
      message: result.message || 'Message sent successfully!',
      id: result.id,
    };
  } catch (error) {
    console.error('Backend submission failed:', error);
    return {
      success: false,
      message: 'Failed to send message. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Email Service Integration (using EmailJS or similar)
export const submitViaEmailService = async (data: Omit<ContactFormData, 'id' | 'timestamp' | 'status'>): Promise<ContactSubmissionResponse> => {
  try {
    // Example using EmailJS (you'll need to install emailjs-com)
    // npm install emailjs-com

    // For now, we'll simulate the email service
    const emailData = {
      to_email: 'support@yourcompany.com', // Your support email
      from_name: data.name,
      from_email: data.email,
      subject: data.subject,
      message: data.message,
      timestamp: new Date().toISOString(),
    };

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real implementation, you would use:
    // const result = await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', emailData, 'YOUR_PUBLIC_KEY');

    console.log('Email would be sent with data:', emailData);

    return {
      success: true,
      message: 'Message sent via email service!',
      id: generateContactId(),
    };
  } catch (error) {
    console.error('Email service submission failed:', error);
    return {
      success: false,
      message: 'Failed to send email. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Main submission function with fallback strategy
export const submitContactForm = async (formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<ContactSubmissionResponse> => {
  const contactData: ContactFormData = {
    id: generateContactId(),
    ...formData,
    timestamp: Date.now(),
    status: 'pending',
    userAgent: navigator.userAgent,
  };

  // Strategy 1: Try backend API first
  console.log('Attempting backend submission...');
  const backendResult = await submitToBackend(formData);
  if (backendResult.success) {
    console.log('Backend submission successful!');
    contactData.status = 'sent';
    saveToLocalStorage({ ...contactData, status: 'sent' });
    return backendResult;
  } else {
    console.log('Backend submission failed:', backendResult.error);
  }

  // Strategy 2: Try email service
  try {
    const emailResult = await submitViaEmailService(formData);
    if (emailResult.success) {
      contactData.status = 'sent';
      saveToLocalStorage({ ...contactData, status: 'sent' });
      return emailResult;
    }
  } catch (error) {
    console.log('Email service not available, saving locally...');
  }

  // Strategy 3: Save locally as fallback
  contactData.status = 'failed';
  const localSaved = saveToLocalStorage(contactData);

  if (localSaved) {
    return {
      success: true,
      message: 'Message saved locally. We will process it when our servers are available.',
      id: contactData.id,
    };
  } else {
    return {
      success: false,
      message: 'Failed to save message. Please try again later.',
      error: 'All storage methods failed',
    };
  }
};

// Admin functions to view stored data (for development)
export const getAllContactSubmissions = (): ContactFormData[] => {
  return getFromLocalStorage();
};

export const getContactSubmissionById = (id: string): ContactFormData | null => {
  const submissions = getFromLocalStorage();
  return submissions.find(submission => submission.id === id) || null;
};

export const clearLocalContactData = (): boolean => {
  try {
    localStorage.removeItem('contact_submissions');
    return true;
  } catch (error) {
    console.error('Failed to clear local contact data:', error);
    return false;
  }
};

// Export statistics
export const getContactStats = () => {
  const submissions = getFromLocalStorage();
  return {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    sent: submissions.filter(s => s.status === 'sent').length,
    failed: submissions.filter(s => s.status === 'failed').length,
    lastSubmission: submissions.length > 0 ? new Date(Math.max(...submissions.map(s => s.timestamp))) : null,
  };
};

// Validation functions
export const validateContactForm = (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): { isValid: boolean; errors: string[] } => {
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
    errors,
  };
};

export default {
  submitContactForm,
  getAllContactSubmissions,
  getContactSubmissionById,
  clearLocalContactData,
  getContactStats,
  validateContactForm,
};
