// TypeScript types for x402 Wrapper API integration

export interface Api {
  id: string;
  user_id: string;
  name: string;
  original_url: string;
  price_per_request: number;
  spl_token_mint: string;
  network: 'devnet' | 'mainnet-beta';
  service_subdomain?: string | null;
  service_domain?: string | null;
  subdomain_url?: string;
  custom_subdomain?: string | null;
  custom_domain?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateApiRequest {
  user_id: string;
  name: string;
  original_url: string;
  price_per_request: number;
  spl_token_mint: string;
  network: 'devnet' | 'mainnet-beta';
  custom_subdomain?: string;
}

export interface PaymentInfo {
  payment: {
    amount: number;
    token: string;
    recipient: string;
    memo?: string;
  };
}

export interface PaymentResponse {
  transaction: string;
  amount: number;
  token: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

