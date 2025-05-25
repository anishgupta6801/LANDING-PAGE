// Node.js/Express backend for handling contact form submissions
// Stores data in contact_submissions.json file

const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:8081', 'http://127.0.0.1:8081'],
  credentials: true
}));
app.use(express.json());

// Data storage file (in production, use a proper database)
const DATA_FILE = path.join(__dirname, 'contact_submissions.json');

// Ensure data file exists
async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch (error) {
    await fs.writeFile(DATA_FILE, JSON.stringify([]));
  }
}

// Read submissions from file
async function readSubmissions() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading submissions:', error);
    return [];
  }
}

// Write submissions to file
async function writeSubmissions(submissions) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing submissions:', error);
    return false;
  }
}

// Generate unique ID
function generateId() {
  return `contact_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

// Validate contact form data
function validateContactData(data) {
  const errors = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (!data.email || data.email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }

  if (!data.subject || data.subject.trim().length === 0) {
    errors.push('Subject is required');
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Submit contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate input
    const validation = validateContactData({ name, email, subject, message });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Create submission object
    const submission = {
      id: generateId(),
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      timestamp: Date.now(),
      status: 'received',
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'Unknown'
    };

    // Read existing submissions
    const submissions = await readSubmissions();

    // Add new submission
    submissions.push(submission);

    // Save to file
    const saved = await writeSubmissions(submissions);

    if (saved) {
      // In a real application, you might also:
      // - Send email notification to admin
      // - Send auto-reply to user
      // - Log to monitoring system

      console.log('New contact submission:', submission.id);

      res.json({
        success: true,
        message: 'Message received successfully!',
        id: submission.id
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to save submission'
      });
    }

  } catch (error) {
    console.error('Error processing contact submission:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all submissions (admin endpoint)
app.get('/api/admin/contacts', async (req, res) => {
  try {
    const submissions = await readSubmissions();

    // Sort by timestamp (newest first)
    submissions.sort((a, b) => b.timestamp - a.timestamp);

    res.json({
      success: true,
      data: submissions,
      count: submissions.length
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submissions'
    });
  }
});

// Get submission by ID
app.get('/api/admin/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const submissions = await readSubmissions();
    const submission = submissions.find(s => s.id === id);

    if (submission) {
      res.json({
        success: true,
        data: submission
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submission'
    });
  }
});

// Delete submission
app.delete('/api/admin/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const submissions = await readSubmissions();
    const index = submissions.findIndex(s => s.id === id);

    if (index !== -1) {
      submissions.splice(index, 1);
      const saved = await writeSubmissions(submissions);

      if (saved) {
        res.json({
          success: true,
          message: 'Submission deleted successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to delete submission'
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete submission'
    });
  }
});

// Get statistics
app.get('/api/admin/stats', async (req, res) => {
  try {
    const submissions = await readSubmissions();

    const stats = {
      total: submissions.length,
      today: submissions.filter(s => {
        const today = new Date();
        const submissionDate = new Date(s.timestamp);
        return submissionDate.toDateString() === today.toDateString();
      }).length,
      thisWeek: submissions.filter(s => {
        const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        return s.timestamp > weekAgo;
      }).length,
      lastSubmission: submissions.length > 0 ?
        Math.max(...submissions.map(s => s.timestamp)) : null
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Start server
async function startServer() {
  await ensureDataFile();

  app.listen(PORT, () => {
    console.log(`Contact form backend running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`Contact endpoint: http://localhost:${PORT}/api/contact`);
    console.log(`Admin endpoint: http://localhost:${PORT}/api/admin/contacts`);
  });
}

startServer().catch(console.error);

// Export for testing
module.exports = app;
