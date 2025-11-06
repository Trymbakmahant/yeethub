'use client';

import { useState } from 'react';

interface AppViewerProps {
  appUrl: string;
}

export function AppViewer({ appUrl }: AppViewerProps) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="h-[calc(100vh-200px)] px-6 pb-6">
      <div className="max-w-7xl mx-auto h-full bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
        {loading && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
              <p className="text-gray-400">Loading app...</p>
            </div>
          </div>
        )}
        <iframe
          src={appUrl}
          className="w-full h-full border-0"
          onLoad={() => setLoading(false)}
          style={{ display: loading ? 'none' : 'block' }}
          title="Deployed App"
          allow="camera; microphone; geolocation; encrypted-media"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
        />
      </div>
    </div>
  );
}
