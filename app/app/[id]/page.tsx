'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Header } from '../../../components/Header';
import { AppViewer } from '../../../components/AppViewer';
import { use } from 'react';

export default function AppPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  // Mock app data - replace with actual API call
  const app = {
    id,
    name: 'Stable Diffusion XL',
    deployedUrl: 'https://app-1.yeethub.io',
  };

  if (!publicKey) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="max-w-4xl mx-auto py-16 px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-gray-400 mb-8">
            Connect your wallet to access this app
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
      <div className="px-6 py-6">
        <div className="max-w-7xl mx-auto mb-4">
          <h1 className="text-2xl font-bold">{app.name}</h1>
        </div>
      </div>
      <AppViewer appUrl={app.deployedUrl} />
    </div>
  );
}
