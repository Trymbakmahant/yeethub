'use client';

import { useState, useEffect } from 'react';
import { apiManagement } from '@/lib/api-management';
import { Api } from '@/lib/types';
import Link from 'next/link';

export function ApiCards() {
  const [apis, setApis] = useState<Api[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApis();
  }, []);

  const loadApis = async () => {
    try {
      const allApis = await apiManagement.listAll();
      // Show latest 6 APIs
      setApis(allApis.slice(0, 6));
    } catch (err) {
      console.error('Error loading APIs:', err);
      setApis([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-black py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            Featured APIs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-gray-900 rounded-lg p-6 border border-gray-800 animate-pulse"
              >
                <div className="h-6 bg-gray-800 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-800 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (apis.length === 0) {
    return null;
  }

  return (
    <div className="bg-black py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
          Featured APIs
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Discover popular APIs wrapped with x402 payments
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apis.map((api) => (
            <div
              key={api.id}
              className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-[#FF6B35] transition-all hover:shadow-lg hover:shadow-[#FF6B35]/20 group"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-white group-hover:text-[#FF6B35] transition">
                  {api.name}
                </h3>
                <span className="px-2 py-1 bg-[#FF6B35]/20 text-[#FF6B35] text-xs font-medium rounded">
                  {api.network}
                </span>
              </div>

              <p className="text-gray-400 text-sm mb-4 line-clamp-2 break-all">
                {api.original_url}
              </p>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Price per Request</p>
                  <p className="text-lg font-bold text-[#FF6B35]">
                    {api.price_per_request} SOL
                  </p>
                </div>
                {api.subdomain_url || (api.service_subdomain && api.service_domain) ? (
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Subdomain</p>
                    <p className="text-sm text-gray-400 font-mono">
                      {api.service_subdomain || 'N/A'}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-800">
                {(api.subdomain_url || (api.service_subdomain && api.service_domain)) && (
                  <a
                    href={api.subdomain_url || `http://${api.service_subdomain}.${api.service_domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#FF6B35] hover:bg-[#ff5722] text-white px-4 py-2 rounded-lg text-sm font-medium transition text-center"
                  >
                    Open API
                  </a>
                )}
                <Link
                  href={`/search?q=${encodeURIComponent(api.name)}`}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/search"
            className="inline-block bg-[#FF6B35] hover:bg-[#ff5722] text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            View All APIs
          </Link>
        </div>
      </div>
    </div>
  );
}

