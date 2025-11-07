// API Management utilities for x402 Wrapper API

import { Api, CreateApiRequest, ApiResponse, Analytics } from './types';

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
   * List all APIs (no user filter)
   */
  async listAll(): Promise<Api[]> {
    const response = await fetch(`${API_BASE_URL}/api/apis`);

    if (!response.ok) {
      throw new Error(`Failed to fetch all APIs: ${response.status}`);
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
   * Get API by name
   */
  async getByName(name: string, userId?: string): Promise<Api | null> {
    let url = `${API_BASE_URL}/api/apis/by-name/${encodeURIComponent(name)}`;
    if (userId) {
      url += `?user_id=${encodeURIComponent(userId)}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch API by name: ${response.status}`);
    }

    const api = await response.json();
    if (!api.subdomain_url && api.service_subdomain && api.service_domain) {
      api.subdomain_url = `http://${api.service_subdomain}.${api.service_domain}`;
    }
    return api;
  },

  /**
   * Get API by original URL
   */
  async getByUrl(originalUrl: string, userId?: string): Promise<Api | null> {
    let url = `${API_BASE_URL}/api/apis/by-url?url=${encodeURIComponent(originalUrl)}`;
    if (userId) {
      url += `&user_id=${encodeURIComponent(userId)}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch API by URL: ${response.status}`);
    }

    const api = await response.json();
    if (!api.subdomain_url && api.service_subdomain && api.service_domain) {
      api.subdomain_url = `http://${api.service_subdomain}.${api.service_domain}`;
    }
    return api;
  },

  /**
   * Search APIs by name or URL
   * Automatically detects if query is a URL or name
   * If query is empty, returns all APIs
   */
  async search(query: string, userId?: string): Promise<Api[]> {
    const trimmedQuery = query.trim();
    
    // If query is empty, return all APIs
    if (!trimmedQuery) {
      return this.listAll();
    }

    // Check if query looks like a URL
    const isUrl = /^https?:\/\//i.test(trimmedQuery) || /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}/.test(trimmedQuery);

    try {
      if (isUrl) {
        // Search by URL
        const api = await this.getByUrl(trimmedQuery, userId);
        return api ? [api] : [];
      } else {
        // Search by name
        const api = await this.getByName(trimmedQuery, userId);
        return api ? [api] : [];
      }
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  },

  /**
   * Get analytics for a user
   */
  async getAnalytics(userId: string): Promise<Analytics> {
    const response = await fetch(`${API_BASE_URL}/api/analytics?user_id=${userId}`);

    if (!response.ok) {
      // If analytics endpoint doesn't exist, return default analytics
      if (response.status === 404) {
        return {
          total_apis: 0,
          total_requests: 0,
          total_revenue: 0,
          revenue_24h: 0,
          requests_24h: 0,
          api_stats: [],
        };
      }
      throw new Error(`Failed to fetch analytics: ${response.status}`);
    }

    return response.json();
  },
};

