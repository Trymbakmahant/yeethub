// Example component demonstrating how to use the wrapped API with x402 payments

'use client';

import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { makePayment } from '@/lib/payment';
import type { PaymentInfo } from '@/lib/types';

interface ApiTesterProps {
  baseUrl: string;
  initialPath?: string;
}

function buildPath(path: string) {
  if (!path) return '/';
  return path.startsWith('/') ? path : `/${path}`;
}

function buildBaseUrl(url: string) {
  return url.replace(/\/+$/g, '');
}

export function ApiTester({ baseUrl, initialPath = '/wrapped/your-api-id' }: ApiTesterProps) {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [path, setPath] = useState(initialPath);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [requestLoading, setRequestLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [paymentMessage, setPaymentMessage] = useState<string | undefined>();
  const [paymentSignature, setPaymentSignature] = useState<string | null>(null);

  const normalizedBase = buildBaseUrl(baseUrl);
  const normalizedPath = buildPath(path);
  const targetUrl = normalizedBase ? `${normalizedBase}${normalizedPath}` : '';

  const resetState = () => {
    setPaymentInfo(null);
    setPaymentMessage(undefined);
    setPaymentSignature(null);
    setResponse(null);
    setError(null);
  };

  const handleRequest = async () => {
    resetState();
    if (!normalizedBase) {
      setError('Base URL is required');
      return;
    }

    setRequestLoading(true);
    try {
      const res = await fetch(targetUrl);
      let data: any = null;
      try {
        data = await res.json();
      } catch (jsonErr) {
        // ignore parse errors for non-JSON responses
      }

      if (res.status === 402 && data?.payment) {
        setPaymentInfo({ payment: data.payment });
        setPaymentMessage(data?.message);
      }

      setResponse({ status: res.status, data });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setRequestLoading(false);
    }
  };

  const handlePayAndRetry = async () => {
    if (!paymentInfo?.payment) {
      setError('No payment instructions available');
      return;
    }
    if (!connection || !wallet.publicKey || !wallet.sendTransaction) {
      setError('Wallet not connected');
      return;
    }

    setPaymentLoading(true);
    try {
      const paymentResult = await makePayment(connection, wallet, paymentInfo.payment);
      setPaymentSignature(paymentResult.transaction);

      const res = await fetch(targetUrl, {
        headers: {
          'X-PAYMENT': JSON.stringify({
            transaction: paymentResult.transaction,
            amount: paymentResult.amount,
            token: paymentResult.token,
          }),
        },
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch (jsonErr) {
        // ignore parse errors
      }

      setResponse({ status: res.status, data });
      if (res.status !== 402) {
        setPaymentInfo(null);
        setPaymentMessage(undefined);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Test API</h3>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            API Path (Wrapped Path)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="/wrapped/12345"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]"
            />
            <button
              onClick={handleRequest}
              disabled={requestLoading || !normalizedBase}
              className="bg-[#FF6B35] hover:bg-[#ff5722] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition"
            >
              {requestLoading ? 'Requesting...' : 'Request'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-red-300 text-sm">
          {error}
        </div>
      )}

      {paymentInfo && paymentInfo.payment && (
        <div className="bg-gray-800/60 border border-[#FF6B35]/40 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white">Payment Required</h4>
            {paymentMessage && <span className="text-xs text-gray-400">{paymentMessage}</span>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-300">
            <div>
              <span className="text-gray-500">Amount</span>
              <div className="font-mono text-[#FF6B35]">{paymentInfo.payment.amount}</div>
            </div>
            <div>
              <span className="text-gray-500">Token</span>
              <div className="font-mono">{paymentInfo.payment.token}</div>
            </div>
            <div>
              <span className="text-gray-500">Recipient</span>
              <div className="font-mono break-all">{paymentInfo.payment.recipient}</div>
            </div>
            {Boolean((paymentInfo.payment as any)?.facilitator) && (
              <div>
                <span className="text-gray-500">Facilitator</span>
                <div className="font-mono break-all">{String((paymentInfo.payment as any).facilitator)}</div>
              </div>
            )}
          </div>

          <button
            onClick={handlePayAndRetry}
            disabled={paymentLoading}
            className="w-full bg-[#FF6B35] hover:bg-[#ff5722] disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            {paymentLoading ? 'Processing Payment...' : 'Pay & Retry'}
          </button>

          {paymentSignature && (
            <p className="text-xs text-gray-400">
              Last transaction signature: <span className="font-mono text-[#FF6B35]">{paymentSignature}</span>
            </p>
          )}
        </div>
      )}

      {response && (
        <div className="bg-gray-800 rounded-lg p-4">
          <pre className="text-xs text-gray-300 overflow-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      <p className="text-xs text-gray-500">
        This tester sends requests to <code>{targetUrl || 'N/A'}</code>. First it shows the 402 payment
        instructions, then – once you approve the Solana transfer – it retries automatically with the
        transaction signature in <code>X-PAYMENT</code>.
      </p>
    </div>
  );
}

