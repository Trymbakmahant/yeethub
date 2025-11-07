'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Header } from '@/components/Header';
import { apiManagement } from '@/lib/api-management';
import { getOrCreateUser } from '@/lib/user-management';

export default function CreateApp() {
  const router = useRouter();
  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const [name, setName] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [pricePerRequest, setPricePerRequest] = useState('0.001');
  const [network, setNetwork] = useState<'devnet' | 'mainnet-beta'>('devnet');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Native SOL mint address
  const NATIVE_SOL_MINT = 'So11111111111111111111111111111111111111112';

  const handleCreate = async () => {
    if (!publicKey) {
      setVisible(true);
      return;
    }

    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('Please enter an API name');
      return;
    }

    if (!originalUrl.trim()) {
      setError('Please enter the original API URL');
      return;
    }

    try {
      const url = new URL(originalUrl);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    const price = parseFloat(pricePerRequest);
    if (isNaN(price) || price <= 0) {
      setError('Please enter a valid price per request');
      return;
    }

    setLoading(true);
    try {
      // Get or create user UUID from wallet address
      const userId = await getOrCreateUser(publicKey.toString());
      
      if (!userId || userId.trim() === '') {
        throw new Error('Failed to get user ID. Please try again.');
      }

      console.log('Creating API with user_id:', userId);
      
      const api = await apiManagement.create({
        user_id: userId,
        name: name.trim(),
        original_url: originalUrl.trim(),
        price_per_request: price,
        spl_token_mint: NATIVE_SOL_MINT,
        network,
      });

      setSuccess(`API created successfully! Subdomain: ${api.subdomain_url}`);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error creating API:', err);
      setError(err instanceof Error ? err.message : 'Failed to create API. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="max-w-4xl mx-auto py-16 px-6">
        <h1 className="text-4xl font-bold mb-8">Create New API Wrapper</h1>
        
        <div className="bg-gray-900 rounded-lg p-8 space-y-6">
          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-900/50 border border-green-700 rounded-lg p-4 text-green-300">
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              API Name
            </label>
            <input
              type="text"
              placeholder="My API"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Original API URL
            </label>
            <input
              type="url"
              placeholder="https://api.example.com"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]"
            />
            <p className="mt-2 text-sm text-gray-400">
              The API endpoint you want to wrap with x402 payments
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price per Request (SOL)
              </label>
              <input
                type="number"
                step="0.000001"
                min="0"
                placeholder="0.001"
                value={pricePerRequest}
                onChange={(e) => setPricePerRequest(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Network
              </label>
              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value as 'devnet' | 'mainnet-beta')}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF6B35]"
              >
                <option value="devnet">Devnet</option>
                <option value="mainnet-beta">Mainnet</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Auto-Assigned Subdomain</h3>
            <p className="text-sm text-gray-400">
              Your API will automatically get a clean subdomain URL like <code className="text-[#FF6B35]">api-abc12345.yourdomain.com</code>
            </p>
          </div>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full bg-[#FF6B35] hover:bg-[#ff5722] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            {loading ? 'Creating API...' : 'Create API Wrapper'}
          </button>
        </div>
      </div>
    </div>
  );
}
