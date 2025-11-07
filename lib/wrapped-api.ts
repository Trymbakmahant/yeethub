// Wrapped API request utilities with x402 payment handling

import { Connection } from '@solana/web3.js';
import { PaymentInfo } from './types';
import { makePayment } from './payment';

export interface RequestOptions extends RequestInit {
  handlePayment?: (paymentInfo: PaymentInfo) => Promise<{ transaction: string; amount: number; token: string }>;
  connection?: Connection;
  wallet?: any;
}

/**
 * Request API via subdomain URL with automatic payment handling
 */
export async function requestViaSubdomain(
  subdomainUrl: string,
  path: string,
  options: RequestOptions = {}
): Promise<Response> {
  const { handlePayment, connection, wallet, ...fetchOptions } = options;
  const url = `${subdomainUrl}${path.startsWith('/') ? path : `/${path}`}`;

  // Make initial request
  let response = await fetch(url, fetchOptions);

  // Handle 402 Payment Required
  if (response.status === 402) {
    const paymentInfo: PaymentInfo = await response.json();
    const paymentPayload = paymentInfo?.payment;

    if (!paymentPayload || !paymentPayload.recipient || !paymentPayload.amount || !paymentPayload.token) {
      throw new Error('Invalid payment response from wrapper service: missing payment details');
    }

    if (!handlePayment && connection && wallet) {
      // Use default payment handler
      const payment = await makePayment(connection, wallet, paymentPayload);
      
      // Retry with payment header
      response = await fetch(url, {
        ...fetchOptions,
        headers: {
          ...fetchOptions.headers,
          'X-PAYMENT': JSON.stringify({
            transaction: payment.transaction,
            amount: payment.amount,
            token: payment.token,
          }),
        },
      });
    } else if (handlePayment) {
      // Use custom payment handler
      const payment = await handlePayment({ payment: paymentPayload });
      
      // Retry with payment header
      response = await fetch(url, {
        ...fetchOptions,
        headers: {
          ...fetchOptions.headers,
          'X-PAYMENT': JSON.stringify({
            transaction: payment.transaction,
            amount: payment.amount,
            token: payment.token,
          }),
        },
      });
    } else {
      throw new Error('Payment required but no payment handler provided');
    }
  }

  return response;
}

/**
 * Request API with automatic retry on payment
 */
export async function requestApi(
  apiUrl: string,
  path: string,
  options: RequestOptions = {}
): Promise<Response> {
  return requestViaSubdomain(apiUrl, path, options);
}

