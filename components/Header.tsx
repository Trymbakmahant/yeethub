'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [searchQuery, setSearchQuery] = useState('');
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const previousQueryRef = useRef<string>('');

  // Debounced search - navigates to search page after user stops typing
  // Only navigate if the query actually changed (user is typing)
  useEffect(() => {
    // Don't navigate if query hasn't changed (e.g., on page load)
    if (searchQuery === previousQueryRef.current) {
      return;
    }

    previousQueryRef.current = searchQuery;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Only navigate if we're not already on a page that shouldn't be navigated away from
    // Allow navigation to search page, but don't force it on other pages
    debounceTimer.current = setTimeout(() => {
      const query = searchQuery.trim();
      
      // Only navigate if:
      // 1. User typed something (query is not empty), OR
      // 2. User cleared the search and we're already on the search page
      if (query) {
        router.push(`/search?q=${encodeURIComponent(query)}`);
      } else if (pathname === '/search') {
        // Only navigate to /search if we're already on search page
        router.push('/search');
      }
    }, 500); // 500ms debounce

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery, router, pathname]);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    const query = searchQuery.trim();
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } else {
      // Navigate to search page without query to show all APIs
      router.push('/search');
    }
  };

  return (
    <header className="bg-black border-b border-gray-800">
      {/* Top navigation */}
      <div className="border-b border-gray-800 px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-gray-400">
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition">DOCS</Link>
            <Link href="#" className="hover:text-white transition">SUPPORT</Link>
          </div>
          <div className="text-gray-500">EN</div>
        </div>
      </div>

      {/* Main header */}
      <div className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-white text-2xl font-bold">Yeet</span>
            <span className="bg-[#FF6B35] text-white px-2 py-1 text-xl font-bold">Hub</span>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search APIs by name or URL..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#FF6B35] transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Wallet connection */}
          <div className="flex items-center gap-3">
            {publicKey ? (
              <>
                <button
                  onClick={() => setVisible(true)}
                  className="bg-[#FF6B35] hover:bg-[#ff5722] text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
                </button>
                <button
                  onClick={disconnect}
                  className="text-gray-400 hover:text-white transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </>
            ) : (
              <button
                onClick={() => setVisible(true)}
                className="bg-[#FF6B35] hover:bg-[#ff5722] text-white px-6 py-2 rounded-lg text-sm font-medium transition"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="border-t border-gray-800 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-white border-b-2 border-[#FF6B35] py-3">HOME</Link>
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition py-3">MY APPS</Link>
          <Link href="/analytics" className="text-gray-400 hover:text-white transition py-3">ANALYTICS</Link>
          <Link href="/create" className="text-gray-400 hover:text-white transition py-3">CREATE APP</Link>
        </div>
      </nav>
    </header>
  );
}
