// Example component demonstrating how to use the wrapped API with x402 payments

'use client';

import { useState } from 'react';
import { useWrappedApi } from '@/lib/hooks/useWrappedApi';

interface ApiTesterProps {
  subdomainUrl: string;
}

export function ApiTester({ subdomainUrl }: ApiTesterProps) {
  const { request, loading, error } = useWrappedApi();
  const [path, setPath] = useState('/posts/1');
  const [response, setResponse] = useState<any>(null);

  const handleRequest = async () => {
    try {
      const res = await request(subdomainUrl, path);
      const data = await res.json();
      setResponse({ status: res.status, data });
    } catch (err) {
      setResponse({ 
        error: err instanceof Error ? err.message : 'Unknown error' 
      });
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold">Test API</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          API Path
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="/posts/1"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]"
          />
          <button
            onClick={handleRequest}
            disabled={loading || !subdomainUrl}
            className="bg-[#FF6B35] hover:bg-[#ff5722] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition"
          >
            {loading ? 'Requesting...' : 'Request'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-red-300 text-sm">
          {error}
        </div>
      )}

      {response && (
        <div className="bg-gray-800 rounded-lg p-4">
          <pre className="text-xs text-gray-300 overflow-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      <p className="text-xs text-gray-500">
        This will automatically handle 402 payment requirements using your connected wallet.
      </p>
    </div>
  );
}

