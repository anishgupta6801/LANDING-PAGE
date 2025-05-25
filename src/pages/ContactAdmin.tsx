import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Separator } from '@/components/ui/separator';
import {
  Sparkles,
  ArrowLeft,
  Users,
  Mail,
  Clock,
  Trash2,
  RefreshCw,
  Download,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getAllContactSubmissions,
  getContactStats,
  clearLocalContactData,
  ContactFormData
} from '../lib/contactStorage';

export const ContactAdmin = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<ContactFormData[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    sent: 0,
    failed: 0,
    lastSubmission: null as Date | null,
  });
  const [selectedSubmission, setSelectedSubmission] = useState<ContactFormData | null>(null);

  const loadData = () => {
    const data = getAllContactSubmissions();
    const statistics = getContactStats();
    setSubmissions(data);
    setStats(statistics);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all contact submissions? This action cannot be undone.')) {
      const success = clearLocalContactData();
      if (success) {
        toast.success('All contact data cleared successfully');
        loadData();
        setSelectedSubmission(null);
      } else {
        toast.error('Failed to clear contact data');
      }
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(submissions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contact_submissions_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Contact data exported successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
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
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Contact Admin</span>
            </div>
          </div>

          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Total Submissions</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">{stats.pending}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500" />
                <div>
                  <div className="text-2xl font-bold">{stats.sent}</div>
                  <div className="text-sm text-muted-foreground">Sent</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-red-500" />
                <div>
                  <div className="text-2xl font-bold">{stats.failed}</div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mb-6">
          <Button onClick={loadData} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button onClick={handleExportData} variant="outline" className="gap-2" disabled={submissions.length === 0}>
            <Download className="w-4 h-4" />
            Export Data
          </Button>
          <Button onClick={handleClearData} variant="destructive" className="gap-2" disabled={submissions.length === 0}>
            <Trash2 className="w-4 h-4" />
            Clear All Data
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submissions List */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Submissions</CardTitle>
              <CardDescription>
                {submissions.length === 0 ? 'No submissions yet' : `${submissions.length} submissions found`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No contact submissions found</p>
                  <p className="text-sm">Submissions will appear here when users fill out the contact form</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {submissions.map((submission) => (
                    <div
                      key={submission.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedSubmission?.id === submission.id ? 'bg-muted border-primary' : ''
                      }`}
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{submission.name}</div>
                          <div className="text-sm text-muted-foreground truncate">{submission.email}</div>
                          <div className="text-sm font-medium truncate">{submission.subject}</div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant={getStatusColor(submission.status)}>
                            {submission.status}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(submission.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submission Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Submission Details
              </CardTitle>
              <CardDescription>
                {selectedSubmission ? 'View full submission details' : 'Select a submission to view details'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedSubmission ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <div className="text-sm bg-muted p-2 rounded">{selectedSubmission.name}</div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <div className="text-sm bg-muted p-2 rounded">{selectedSubmission.email}</div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <div className="text-sm bg-muted p-2 rounded">{selectedSubmission.subject}</div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <div className="text-sm bg-muted p-3 rounded whitespace-pre-wrap">{selectedSubmission.message}</div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="font-medium">Status</label>
                      <div>
                        <Badge variant={getStatusColor(selectedSubmission.status)}>
                          {selectedSubmission.status}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <label className="font-medium">Submitted</label>
                      <div>{formatDate(selectedSubmission.timestamp)}</div>
                    </div>

                    <div className="col-span-2">
                      <label className="font-medium">ID</label>
                      <div className="text-xs font-mono bg-muted p-1 rounded">{selectedSubmission.id}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a submission from the list to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-background/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-blue-600 rounded flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">LANDING PAGE GENERATOR - Admin</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Contact submissions are stored locally for development purposes
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactAdmin;
