import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

export const FormDebugInfo: React.FC = () => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'unknown';
  const isProduction = hostname !== 'localhost' && hostname !== '127.0.0.1' && !hostname.includes('localhost');
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'unknown';

  return (
    <Card className="mt-4 border-orange-200 bg-orange-50 dark:bg-orange-950/20">
      <CardHeader>
        <CardTitle className="text-sm text-orange-800 dark:text-orange-200">
          🔧 Form Debug Information
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-medium">Environment:</span>
            <Badge variant={isProduction ? "default" : "secondary"} className="ml-2">
              {isProduction ? "Production" : "Development"}
            </Badge>
          </div>
          <div>
            <span className="font-medium">Hostname:</span>
            <span className="ml-2 font-mono">{hostname}</span>
          </div>
        </div>

        <div>
          <span className="font-medium">Current URL:</span>
          <div className="font-mono text-xs break-all">{currentUrl}</div>
        </div>

        <div className="pt-2 border-t border-orange-200">
          <div className="text-orange-700 dark:text-orange-300">
            {isProduction ? (
              <>
                ✅ <strong>Production Mode:</strong> Forms will be submitted to Netlify
              </>
            ) : (
              <>
                🔧 <strong>Development Mode:</strong> Forms will attempt real submission to Netlify
              </>
            )}
          </div>
        </div>

        <div className="pt-2 text-orange-600 dark:text-orange-400">
          <strong>Troubleshooting:</strong>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Check browser console for detailed logs</li>
            <li>Verify Netlify Forms are enabled in dashboard</li>
            <li>Ensure form name "help-contact" is detected</li>
            <li>Form will attempt real submission in all environments</li>
            {!isProduction && <li>Local submissions may fail if not deployed to Netlify</li>}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormDebugInfo;
