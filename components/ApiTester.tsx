// Example component demonstrating how to use the wrapped API with x402 payments

'use client';

import { useState } from 'react';
import { useWrappedApi } from '@/lib/hooks/useWrappedApi';

interface ApiTesterProps {
  baseUrl: string;
  initialPath?: string;
}

function buildPath(path: string) {
  if (!path) return '/';
  return path.startsWith('/') ? path : `/${path}`;
}

function buildBaseUrl(url: string) {
  return url.replace(/\/+$/g, '');
}

export function ApiTester({ baseUrl, initialPath = '/wrapped/your-api-id' }: ApiTesterProps) {
  const { request, loading, error } = useWrappedApi();
  const [path, setPath] = useState(initialPath);
  const [response, setResponse] = useState<any>(null);

  const handleRequest = async () => {
    try {
      const normalizedBase = buildBaseUrl(baseUrl);
      const normalizedPath = buildPath(path);
      if (!normalizedBase) {
        throw new Error('Base URL is required');
      }

      const res = await request(normalizedBase, normalizedPath);
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
          API Path (Wrapped Path)
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
            disabled={loading || !baseUrl}
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
        This tester calls the URL composed from the base URL + wrapped path and automatically handles 402 payment requirements using your connected wallet.
      </p>
    </div>
  );
}

