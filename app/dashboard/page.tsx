'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Header } from '../../components/Header';
import Link from 'next/link';

// Mock data - replace with actual API call
const mockApps = [
  {
    id: '1',
    name: 'Stable Diffusion XL',
    huggingFaceUrl: 'https://huggingface.co/spaces/stabilityai/stable-diffusion-xl-base-1.0',
    deployedUrl: 'https://app-1.yeethub.io',
    createdAt: '2024-01-15',
    status: 'running',
  },
  {
    id: '2',
    name: 'LLaMA Chat',
    huggingFaceUrl: 'https://huggingface.co/spaces/huggingface/llama-chat',
    deployedUrl: 'https://app-2.yeethub.io',
    createdAt: '2024-01-10',
    status: 'running',
  },
];

export default function Dashboard() {
  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  if (!publicKey) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="max-w-4xl mx-auto py-16 px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-gray-400 mb-8">
            Connect your Solana wallet to view your deployment history
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
          <h1 className="text-4xl font-bold">My Apps</h1>
          <Link
            href="/create"
            className="bg-[#FF6B35] hover:bg-[#ff5722] text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Create New App
          </Link>
        </div>

        <div className="mb-4 text-gray-400">
          Wallet: {publicKey.toString()}
        </div>

        <div className="grid gap-6">
          {mockApps.length === 0 ? (
            <div className="bg-gray-900 rounded-lg p-12 text-center">
              <p className="text-gray-400 mb-4">No apps deployed yet</p>
              <Link
                href="/create"
                className="text-[#FF6B35] hover:text-[#ff5722] font-semibold"
              >
                Create your first app →
              </Link>
            </div>
          ) : (
            mockApps.map((app) => (
              <div key={app.id} className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{app.name}</h3>
                    <p className="text-sm text-gray-400 mb-2">
                      Source: <a href={app.huggingFaceUrl} target="_blank" rel="noopener noreferrer" className="text-[#FF6B35] hover:underline">{app.huggingFaceUrl}</a>
                    </p>
                    <p className="text-sm text-gray-400 mb-4">
                      Deployed: {app.createdAt}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        app.status === 'running' 
                          ? 'bg-green-900 text-green-300' 
                          : 'bg-gray-700 text-gray-300'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={`/app/${app.id}`}
                      className="bg-[#FF6B35] hover:bg-[#ff5722] text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                      Open App
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
