'use client';

import { useEffect, useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Header } from '@/components/Header';
import { ApiTester } from '@/components/ApiTester';
import { apiManagement } from '@/lib/api-management';
import type { Api } from '@/lib/types';

export default function TestPage() {
  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const [baseUrl, setBaseUrl] = useState('https://api.example.com');
  const [wrappedPath, setWrappedPath] = useState('/wrapped/your-api-id');
  const [apis, setApis] = useState<Api[]>([]);
  const [selectedApiId, setSelectedApiId] = useState<string>('');
  const [loadingApis, setLoadingApis] = useState<boolean>(false);

  useEffect(() => {
    const loadApis = async () => {
      setLoadingApis(true);
      try {
        const list = await apiManagement.listAll();
        setApis(list);
      } catch (error) {
        console.error('Failed to load APIs for testing playground', error);
        setApis([]);
      } finally {
        setLoadingApis(false);
      }
    };

    loadApis();
  }, []);

  const handleSelectApi = (apiId: string) => {
    setSelectedApiId(apiId);
    const api = apis.find((item) => item.id === apiId);
    if (!api) return;

    const derivedBase = api.original_url ? api.original_url.replace(/\/+$/, '') : baseUrl;
    setBaseUrl(derivedBase);
    if (api.wrapped_path) {
      setWrappedPath(api.wrapped_path);
    }
  };

  const dropdownOptions = useMemo(() => {
    return apis.map((api) => ({
      id: api.id,
      label: `${api.name} • ${api.wrapped_path ?? 'no wrapped path'}`,
    }));
  }, [apis]);

  const instructions = (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 space-y-3">
      <h2 className="text-xl font-semibold text-white">How testing works</h2>
      <ol className="list-decimal list-inside text-sm text-gray-300 space-y-2">
        <li>Connect your wallet (must match the owner of the API wrapper).</li>
        <li>Select one of your wrapped APIs from the dropdown below or provide the details manually.</li>
        <li>Ensure the base URL points to the original API endpoint you wrapped (for example <code className="text-[#FF6B35]">https://api.example.com</code>).</li>
        <li>Use the <code className="text-[#FF6B35]">wrapped_path</code> returned by the wrapper service, such as <code className="text-[#FF6B35]">/wrapped/12345</code>.</li>
        <li>The tester combines base URL + wrapped path, issues the request, and automatically handles 402 payment flow when required.</li>
        <li>Review the response payload to confirm your backend behaves as expected after payment.</li>
      </ol>
    </div>
  );

  if (!publicKey) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="max-w-4xl mx-auto py-16 px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Testing Playground</h1>
          <p className="text-gray-400 mb-8">
            Connect your Solana wallet to run paid requests against your wrapped APIs.
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
      <div className="max-w-5xl mx-auto py-16 px-6 space-y-10">
        <div>
          <h1 className="text-4xl font-bold mb-4">Testing Playground</h1>
          <p className="text-gray-400">
            Run live requests against your wrapped APIs and verify that payments complete correctly before allowing downstream access.
          </p>
        </div>

        {instructions}

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Wrapped API
              </label>
              <select
                value={selectedApiId}
                onChange={(event) => handleSelectApi(event.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF6B35]"
              >
                <option value="">
                  {loadingApis ? 'Loading APIs…' : 'Choose an API to auto-fill details'}
                </option>
                {dropdownOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Base URL (Original API URL)
              </label>
              <input
                type="url"
                value={baseUrl}
                onChange={(event) => setBaseUrl(event.target.value)}
                placeholder="https://api.example.com"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Wrapped Path
              </label>
              <input
                type="text"
                value={wrappedPath}
                onChange={(event) => setWrappedPath(event.target.value)}
                placeholder="/wrapped/your-api-id"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]"
              />
              <p className="text-xs text-gray-500 mt-2">
                Paste the <code className="text-[#FF6B35]">wrapped_path</code> value shown in the dashboard. You can swap to a subdomain by entering it as the base URL and using a standard endpoint path.
              </p>
            </div>
          </div>
        </div>

        {baseUrl ? (
          <ApiTester baseUrl={baseUrl} initialPath={wrappedPath} />
        ) : (
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 text-sm text-gray-400">
            Enter a valid base URL above to begin testing.
          </div>
        )}
      </div>
    </div>
  );
}


