// API Management utilities for x402 Wrapper API

import { Api, CreateApiRequest, ApiResponse } from './types';

// TODO: Replace with your actual API domain
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6969';

export const apiManagement = {
  /**
   * Create a new API wrapper
   */
  async create(data: CreateApiRequest): Promise<Api> {
    const response = await fetch(`${API_BASE_URL}/api/apis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to create API' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  },

  /**
   * Get API by ID
   */
  async getById(id: string): Promise<Api> {
    const response = await fetch(`${API_BASE_URL}/api/apis/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch API: ${response.status}`);
    }

    return response.json();
  },

  /**
   * List APIs for a user
   */
  async list(userId: string): Promise<Api[]> {
    const response = await fetch(`${API_BASE_URL}/api/apis?user_id=${userId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch APIs: ${response.status}`);
    }

    const data = await response.json();
    
    // Ensure we have an array
    const apis = Array.isArray(data) ? data : (data.apis || data.data || []);
    
    // Construct subdomain_url if not present
    return apis.map((api: Api) => {
      if (!api.subdomain_url && api.service_subdomain && api.service_domain) {
        api.subdomain_url = `http://${api.service_subdomain}.${api.service_domain}`;
      }
      return api;
    });
  },

  /**
   * Update API
   */
  async update(id: string, data: Partial<CreateApiRequest>): Promise<Api> {
    const response = await fetch(`${API_BASE_URL}/api/apis/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update API: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Delete API
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/apis/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete API: ${response.status}`);
    }
  },

  /**
   * Search APIs by name or other criteria
   */
  async search(query: string): Promise<Api[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/apis/search?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      // If search endpoint doesn't exist, return empty array
      if (response.status === 404) {
        return [];
      }
      throw new Error(`Failed to search APIs: ${response.status}`);
    }

    const data = await response.json();
    const apis = Array.isArray(data) ? data : (data.apis || data.data || []);
    
    // Construct subdomain_url if not present
    return apis.map((api: Api) => {
      if (!api.subdomain_url && api.service_subdomain && api.service_domain) {
        api.subdomain_url = `http://${api.service_subdomain}.${api.service_domain}`;
      }
      return api;
    });
  },
};

