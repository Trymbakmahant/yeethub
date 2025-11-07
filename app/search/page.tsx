'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { apiManagement } from '@/lib/api-management';
import { Api } from '@/lib/types';
import Link from 'next/link';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [apis, setApis] = useState<Api[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      searchApis(query);
    } else {
      setLoading(false);
    }
  }, [query]);

  const searchApis = async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await apiManagement.search(searchQuery);
      setApis(results);
    } catch (err) {
      console.error('Error searching APIs:', err);
      setError(err instanceof Error ? err.message : 'Failed to search APIs');
      setApis([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="max-w-7xl mx-auto py-16 px-6">
        <h1 className="text-4xl font-bold mb-8">
          {query ? `Search Results for "${query}"` : 'Search APIs'}
        </h1>

        {loading ? (
          <div className="bg-gray-900 rounded-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
            <p className="text-gray-400">Searching...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-6">
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={() => query && searchApis(query)}
              className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Retry
            </button>
          </div>
        ) : !query ? (
          <div className="bg-gray-900 rounded-lg p-12 text-center">
            <p className="text-gray-400 mb-4">Enter a search query to find APIs</p>
            <Link
              href="/"
              className="text-[#FF6B35] hover:text-[#ff5722] font-semibold"
            >
              Go to Home →
            </Link>
          </div>
        ) : apis.length === 0 ? (
          <div className="bg-gray-900 rounded-lg p-12 text-center">
            <p className="text-gray-400 mb-4">No APIs found matching "{query}"</p>
            <Link
              href="/create"
              className="text-[#FF6B35] hover:text-[#ff5722] font-semibold"
            >
              Create your own API →
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            <p className="text-gray-400 text-sm mb-4">
              Found {apis.length} {apis.length === 1 ? 'API' : 'APIs'}
            </p>
            {apis.map((api) => (
              <div key={api.id} className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{api.name}</h3>
                    <div className="space-y-2 text-sm text-gray-400">
                      <p>
                        <span className="text-gray-500">Original URL:</span>{' '}
                        <a
                          href={api.original_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#FF6B35] hover:underline break-all"
                        >
                          {api.original_url}
                        </a>
                      </p>
                      {(api.subdomain_url || (api.service_subdomain && api.service_domain)) && (
                        <p>
                          <span className="text-gray-500">Subdomain URL:</span>{' '}
                          <a
                            href={api.subdomain_url || `http://${api.service_subdomain}.${api.service_domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#FF6B35] hover:underline"
                          >
                            {api.subdomain_url || `http://${api.service_subdomain}.${api.service_domain}`}
                          </a>
                        </p>
                      )}
                      <p>
                        <span className="text-gray-500">Price:</span>{' '}
                        {api.price_per_request} SOL per request
                      </p>
                      <p>
                        <span className="text-gray-500">Network:</span>{' '}
                        {api.network}
                      </p>
                      {api.created_at && (
                        <p>
                          <span className="text-gray-500">Created:</span>{' '}
                          {new Date(api.created_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 ml-6">
                    {(api.subdomain_url || (api.service_subdomain && api.service_domain)) && (
                      <a
                        href={api.subdomain_url || `http://${api.service_subdomain}.${api.service_domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#FF6B35] hover:bg-[#ff5722] text-white px-4 py-2 rounded-lg text-sm font-medium transition text-center"
                      >
                        Open API
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="max-w-7xl mx-auto py-16 px-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto"></div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}

