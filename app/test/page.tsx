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
  const [baseUrl, setBaseUrl] = useState(process.env.NEXT_PUBLIC_API_BASE_URL || '');
  const [wrappedPath, setWrappedPath] = useState('');
  const [apis, setApis] = useState<Api[]>([]);
  const [selectedApiId, setSelectedApiId] = useState<string>('');
  const [loadingApis, setLoadingApis] = useState<boolean>(false);

  useEffect(() => {
    const loadApis = async () => {
      setLoadingApis(true);
      try {
        const list = await apiManagement.listAll();
        const wrappers = list.filter((item) => item.wrapped_path);
        setApis(list);
        if (wrappers.length > 0 && !selectedApiId) {
          const first = wrappers[0];
          setSelectedApiId(first.id);
          setWrappedPath(first.wrapped_path || '');
        }
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

    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
      setBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/+$/, ''));
    }
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

  const trimmedBaseUrl = baseUrl?.replace(/\/+$/, '');
  const normalizedPath = wrappedPath?.startsWith('/') ? wrappedPath : wrappedPath ? `/${wrappedPath}` : '';

  const curlExample = useMemo(() => {
    if (!trimmedBaseUrl || !normalizedPath) return null;
    return `curl -i \\
  ${trimmedBaseUrl}${normalizedPath}`;
  }, [trimmedBaseUrl, normalizedPath]);

  const curlWithPaymentExample = useMemo(() => {
    if (!trimmedBaseUrl || !normalizedPath) return null;
    return `curl -i \\
  -H \"X-PAYMENT: {\\\\\"transaction\\\\\":\\\"<sig>\\\"}\" \\
  ${trimmedBaseUrl}${normalizedPath}`;
  }, [trimmedBaseUrl, normalizedPath]);

  const instructions = (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 space-y-3">
      <h2 className="text-xl font-semibold text-white">How testing works</h2>
      <ol className="list-decimal list-inside text-sm text-gray-300 space-y-2">
        <li>Create or locate a wrapper record (note the <code className="text-[#FF6B35]">id</code> and <code className="text-[#FF6B35]">wrapped_path</code>).</li>
        <li>(Optional) <code className="text-[#FF6B35]">GET /api/apis/&lt;id&gt;</code> to ensure the record exists in the environment you’re hitting.</li>
        <li>Call <code className="text-[#FF6B35]">NEXT_PUBLIC_API_BASE_URL + wrapped_path</code> <strong>without</strong> an <code className="text-[#FF6B35]">X-PAYMENT</code> header to receive a <code className="text-[#FF6B35]">402</code> payload containing payment instructions.</li>
        <li>Send the Solana transfer specified in that payload (via your facilitator or wallet tooling) and keep the transaction signature.</li>
        <li>
          Retry the wrapped path with{' '}
          <code className="text-[#FF6B35]">
            X-PAYMENT: {'{"transaction":"<signature>"}'}
          </code>
          . A valid signature unlocks the proxied response.
        </li>
        <li>(Optional) Inspect analytics/tables such as <code className="text-[#FF6B35]">api_requests</code> to confirm the payment was recorded.</li>
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
                Base URL (defaults to NEXT_PUBLIC_API_BASE_URL)
              </label>
              <input
                type="url"
                value={baseUrl}
                onChange={(event) => setBaseUrl(event.target.value)}
                placeholder="https://yourdomain.com"
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
                Paste the <code className="text-[#FF6B35]">wrapped_path</code> value shown in the dashboard. Requests will be sent to <code className="text-[#FF6B35]">{`${baseUrl || 'NEXT_PUBLIC_API_BASE_URL'}`}</code> + wrapped path.
              </p>
            </div>
          </div>
        </div>

        {curlExample && curlWithPaymentExample && (
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">Step 3 — Initial request (expect 402)</h3>
              <pre className="text-xs text-gray-300 overflow-auto bg-gray-800/60 border border-gray-700 rounded-md p-4">
                {curlExample}
              </pre>
              <p className="text-xs text-gray-500 mt-2">
                This call should return <code className="text-[#FF6B35]">402 Payment Required</code> and include the payment instructions (amount, token, recipient, facilitator, network).
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">Step 5 — Retry with signature</h3>
              <pre className="text-xs text-gray-300 overflow-auto bg-gray-800/60 border border-gray-700 rounded-md p-4">
                {curlWithPaymentExample}
              </pre>
              <p className="text-xs text-gray-500 mt-2">
                Replace <code className="text-[#FF6B35]">&lt;sig&gt;</code> with the confirmed Solana transaction signature from step 4.
              </p>
            </div>
          </div>
        )}

        {baseUrl && wrappedPath ? (
          <ApiTester baseUrl={baseUrl} initialPath={wrappedPath} />
        ) : (
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 text-sm text-gray-400">
            Enter a base URL and wrapped path to begin testing.
          </div>
        )}
      </div>
    </div>
  );
}


