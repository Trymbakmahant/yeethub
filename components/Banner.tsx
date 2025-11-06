'use client';

import Link from 'next/link';

export function Banner() {
  return (
    <div className="bg-black py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-cyan-400 via-green-400 to-purple-400 bg-clip-text text-transparent text-6xl font-bold text-center mb-6">
          the official deployment platform
        </div>
        <div className="text-center mb-8">
          <p className="text-purple-400 text-lg font-mono mb-4">
            Deploy Hugging Face Spaces • Use Docker • Pay with x402
          </p>
          <Link
            href="/create"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-cyan-200 px-8 py-4 rounded-lg text-lg font-semibold transition"
          >
            Create New App
          </Link>
        </div>
      </div>
    </div>
  );
}
