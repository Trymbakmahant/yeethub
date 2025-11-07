'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Header } from '@/components/Header';
import Link from 'next/link';
import { apiManagement } from '@/lib/api-management';
import { Api } from '@/lib/types';
import { getOrCreateUser } from '@/lib/user-management';

export default function Dashboard() {
  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const [apis, setApis] = useState<Api[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (publicKey) {
      loadApis();
    } else {
      setLoading(false);
    }
  }, [publicKey]);

  const loadApis = async () => {
    if (!publicKey) return;

    setLoading(true);
    setError(null);
    try {
      // Get user UUID from wallet address
      const userId = await getOrCreateUser(publicKey.toString());
      const userApis = await apiManagement.list(userId);
      
      // Ensure we have an array
      if (!Array.isArray(userApis)) {
        console.error('Expected array but got:', typeof userApis, userApis);
        setApis([]);
        return;
      }
      
      setApis(userApis);
    } catch (err) {
      console.error('Error loading APIs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load APIs');
      setApis([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="max-w-4xl mx-auto py-16 px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-gray-400 mb-8">
            Connect your Solana wallet to view your APIs
          </p>
          <button
            onClick={() => setVisible(true)}
            className="bg-[#FF6B35] hover:bg-[#ff5722] text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="max-w-7xl mx-auto py-16 px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">My APIs</h1>
          <Link
            href="/create"
            className="bg-[#FF6B35] hover:bg-[#ff5722] text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Create New API
          </Link>
        </div>

        <div className="mb-4 text-gray-400">
          Wallet: {publicKey.toString()}
        </div>

        {loading ? (
          <div className="bg-gray-900 rounded-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
            <p className="text-gray-400">Loading APIs...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-6">
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={loadApis}
              className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Retry
            </button>
          </div>
        ) : !Array.isArray(apis) || apis.length === 0 ? (
          <div className="bg-gray-900 rounded-lg p-12 text-center">
            <p className="text-gray-400 mb-4">No APIs created yet</p>
            <Link
              href="/create"
              className="text-[#FF6B35] hover:text-[#ff5722] font-semibold"
            >
              Create your first API →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apis.map((api) => (
              <div
                key={api.id}
                className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-[#FF6B35] transition-all hover:shadow-lg hover:shadow-[#FF6B35]/20 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white group-hover:text-[#FF6B35] transition flex-1">
                    {api.name}
                  </h3>
                  <span className="px-2 py-1 bg-[#FF6B35]/20 text-[#FF6B35] text-xs font-medium rounded ml-2">
                    {api.network}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Original URL</p>
                    <a
                      href={api.original_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF6B35] hover:underline text-sm break-all line-clamp-2"
                    >
                      {api.original_url}
                    </a>
                  </div>

                  {(api.subdomain_url || (api.service_subdomain && api.service_domain)) && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Subdomain URL</p>
                      <a
                        href={api.subdomain_url || `http://${api.service_subdomain}.${api.service_domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FF6B35] hover:underline text-sm font-mono"
                      >
                        {api.subdomain_url || `http://${api.service_subdomain}.${api.service_domain}`}
                      </a>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Price per Request</p>
                      <p className="text-lg font-bold text-[#FF6B35]">
                        {api.price_per_request} SOL
                      </p>
                    </div>
                    {api.created_at && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Created</p>
                        <p className="text-sm text-gray-400">
                          {new Date(api.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
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
                  <button
                    onClick={async () => {
                      if (confirm('Are you sure you want to delete this API?')) {
                        try {
                          await apiManagement.delete(api.id);
                          await loadApis();
                        } catch (err) {
                          alert('Failed to delete API');
                        }
                      }
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

