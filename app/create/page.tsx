'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Header } from '@/components/Header';

export default function CreateApp() {
  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const [huggingFaceUrl, setHuggingFaceUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!publicKey) {
      setVisible(true);
      return;
    }

    if (!huggingFaceUrl.trim()) {
      alert('Please enter a Hugging Face Space URL');
      return;
    }

    setLoading(true);
    try {
      // TODO: Integrate with backend API to create app
      // This will deploy the Docker container and return the app URL
      console.log('Creating app with URL:', huggingFaceUrl);
      alert('App creation started! This will be integrated with your backend.');
    } catch (error) {
      console.error('Error creating app:', error);
      alert('Failed to create app. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="max-w-4xl mx-auto py-16 px-6">
        <h1 className="text-4xl font-bold mb-8">Create New Yeet App</h1>
        
        <div className="bg-gray-900 rounded-lg p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Hugging Face Space URL
            </label>
            <input
              type="text"
              placeholder="https://huggingface.co/spaces/username/space-name"
              value={huggingFaceUrl}
              onChange={(e) => setHuggingFaceUrl(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]"
            />
            <p className="mt-2 text-sm text-gray-400">
              Enter the full URL of your Hugging Face Space
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Payment Method</h3>
            <p className="text-sm text-gray-400">
              You will be charged using x402 tokens for deployment and usage
            </p>
          </div>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full bg-[#FF6B35] hover:bg-[#ff5722] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            {loading ? 'Deploying...' : 'Create & Deploy App'}
          </button>
        </div>
      </div>
    </div>
  );
}
