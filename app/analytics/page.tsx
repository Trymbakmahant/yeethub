'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Header } from '@/components/Header';
import { apiManagement } from '@/lib/api-management';
import { getOrCreateUser } from '@/lib/user-management';
import { Analytics } from '@/lib/types';

export default function AnalyticsPage() {
  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (publicKey) {
      loadAnalytics();
    } else {
      setLoading(false);
    }
  }, [publicKey]);

  const loadAnalytics = async () => {
    if (!publicKey) return;

    setLoading(true);
    setError(null);
    try {
      const userId = await getOrCreateUser(publicKey.toString());
      const data = await apiManagement.getAnalytics(userId);
      setAnalytics(data);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
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
            Connect your Solana wallet to view analytics
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
        <h1 className="text-4xl font-bold mb-8">Analytics Dashboard</h1>

        {loading ? (
          <div className="bg-gray-900 rounded-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
            <p className="text-gray-400">Loading analytics...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-6">
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={loadAnalytics}
              className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Retry
            </button>
          </div>
        ) : analytics ? (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm font-medium">Total APIs</h3>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-white">{analytics.total_apis}</p>
              </div>

              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm font-medium">Total Requests</h3>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-white">{analytics.total_requests.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">+{analytics.requests_24h.toLocaleString()} last 24h</p>
              </div>

              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm font-medium">Total Revenue</h3>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-[#FF6B35]">{analytics.total_revenue.toFixed(4)} SOL</p>
                <p className="text-xs text-gray-500 mt-1">+{analytics.revenue_24h.toFixed(4)} SOL last 24h</p>
              </div>

              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm font-medium">Avg per Request</h3>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-white">
                  {analytics.total_requests > 0 
                    ? (analytics.total_revenue / analytics.total_requests).toFixed(6)
                    : '0.000000'
                  } SOL
                </p>
                <p className="text-xs text-gray-500 mt-1">Average revenue per request</p>
              </div>
            </div>

            {/* API Stats Table */}
            {analytics.api_stats && analytics.api_stats.length > 0 ? (
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">API Performance</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">API Name</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Total Requests</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Requests (24h)</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Total Revenue</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Revenue (24h)</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Price/Request</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.api_stats.map((stat, index) => (
                        <tr key={stat.api_id} className={`border-b border-gray-800 ${index % 2 === 0 ? 'bg-gray-800/30' : ''}`}>
                          <td className="py-4 px-4">
                            <div className="font-medium text-white">{stat.api_name}</div>
                          </td>
                          <td className="py-4 px-4 text-right text-gray-300">
                            {stat.total_requests.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-right text-gray-300">
                            <span className="text-green-400">+{stat.requests_24h.toLocaleString()}</span>
                          </td>
                          <td className="py-4 px-4 text-right text-[#FF6B35] font-medium">
                            {stat.total_revenue.toFixed(4)} SOL
                          </td>
                          <td className="py-4 px-4 text-right text-[#FF6B35]">
                            <span className="text-green-400">+{stat.revenue_24h.toFixed(4)}</span> SOL
                          </td>
                          <td className="py-4 px-4 text-right text-gray-400">
                            {stat.price_per_request.toFixed(6)} SOL
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-lg p-12 text-center">
                <p className="text-gray-400 mb-4">No API statistics available yet</p>
                <p className="text-sm text-gray-500">
                  Create APIs and start receiving requests to see analytics
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

