// React hook for wrapped API requests

import { useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { requestViaSubdomain } from '../wrapped-api';
import { PaymentInfo } from '../types';
import { makePayment } from '../payment';

export interface UseWrappedApiReturn {
  request: (
    subdomainUrl: string,
    path: string,
    options?: RequestInit
  ) => Promise<Response>;
  loading: boolean;
  error: string | null;
}

export function useWrappedApi(): UseWrappedApiReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { connection } = useConnection();
  const wallet = useWallet();

  const request = useCallback(
    async (
      subdomainUrl: string,
      path: string,
      options: RequestInit = {}
    ): Promise<Response> => {
      setLoading(true);
      setError(null);

      try {
        const handlePayment = async (paymentInfo: PaymentInfo) => {
          if (!connection || !wallet.publicKey) {
            throw new Error('Wallet not connected');
          }

          return await makePayment(connection, wallet, paymentInfo.payment);
        };

        const response = await requestViaSubdomain(subdomainUrl, path, {
          ...options,
          handlePayment,
          connection,
          wallet,
        });

        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [connection, wallet]
  );

  return { request, loading, error };
}

