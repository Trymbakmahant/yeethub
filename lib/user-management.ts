// User management utilities for mapping wallet addresses to user UUIDs

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6969';

export interface User {
  id: string; // UUID
  wallet_address?: string;
}

/**
 * Get or create a user by wallet address
 * Returns the user UUID
 */
export async function getOrCreateUser(walletAddress: string): Promise<string> {
  if (!walletAddress || walletAddress.trim() === '') {
    throw new Error('Wallet address is required');
  }

  const userLookupUrl = `${API_BASE_URL}/api/users?wallet_address=${encodeURIComponent(walletAddress)}`;

  // 1. Try to fetch existing user first
  try {
    const response = await fetch(userLookupUrl);
    if (response.ok) {
      const data = await response.json();
      const existingUser = extractUser(data);
      if (existingUser?.id) {
        return existingUser.id;
      }
    } else if (response.status !== 404) {
      console.warn('Failed to fetch user by wallet address', response.status);
    }
  } catch (error) {
    console.warn('Error fetching user by wallet address', error);
  }

  // 2. Create user only if not found
  try {
    const createResponse = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wallet_address: walletAddress }),
    });

    if (createResponse.ok) {
      const createdData = await createResponse.json();
      const createdUser = extractUser(createdData);
      if (createdUser?.id) {
        return createdUser.id;
      }
    } else if (createResponse.status === 409) {
      // User already exists – re-fetch to get the ID
      const retryResponse = await fetch(userLookupUrl);
      if (retryResponse.ok) {
        const retryData = await retryResponse.json();
        const retryUser = extractUser(retryData);
        if (retryUser?.id) {
          return retryUser.id;
        }
      }
    } else {
      const errorText = await safeReadText(createResponse);
      console.error('Failed to create user', createResponse.status, errorText);
    }
  } catch (error) {
    console.error('Error creating user', error);
  }

  throw new Error('Unable to resolve user account for wallet address');
}

function extractUser(data: any): User | null {
  if (!data) return null;

  const normalize = (value: any): User | null => {
    if (!value) return null;
    if (typeof value === 'object' && value.id) return value as User;
    return null;
  };

  if (Array.isArray(data)) {
    const candidate = data.find((item) => item && item.id);
    return normalize(candidate);
  }

  if (data.data) {
    if (Array.isArray(data.data)) {
      const candidate = data.data.find((item: any) => item && item.id);
      return normalize(candidate);
    }
    return normalize(data.data);
  }

  if (data.user) {
    return normalize(data.user);
  }

  return normalize(data);
}

async function safeReadText(response: Response): Promise<string | undefined> {
  try {
    return await response.text();
  } catch (err) {
    console.warn('Failed to read response text', err);
    return undefined;
  }
}

/**
 * Generate a deterministic UUID v4-like from wallet address
 * This ensures the same wallet always gets the same UUID
 */
function generateUUIDFromWallet(walletAddress: string): string {
  // Create a simple hash from the wallet address
  let hash = 0;
  for (let i = 0; i < walletAddress.length; i++) {
    const char = walletAddress.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Generate a UUID v4-like string (not cryptographically secure, but deterministic)
  // Create a 32-character hex string by hashing different parts of the address
  let fullHex = '';
  for (let i = 0; i < walletAddress.length; i++) {
    const charCode = walletAddress.charCodeAt(i);
    const segment = ((hash + charCode * (i + 1)) >>> 0).toString(16).padStart(8, '0');
    fullHex += segment.substring(0, 8);
    if (fullHex.length >= 32) break;
  }
  
  // Ensure we have exactly 32 hex characters
  fullHex = fullHex.padEnd(32, '0').substring(0, 32);
  
  // Format as UUID: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  const uuid = [
    fullHex.substring(0, 8),
    fullHex.substring(8, 12),
    '4' + fullHex.substring(13, 16), // Version 4
    ((parseInt(fullHex[16] || '8', 16) & 0x3) | 0x8).toString(16) + fullHex.substring(17, 20), // Variant bits (8, 9, a, or b)
    fullHex.substring(20, 32)
  ].join('-');
  
  // Validate UUID format
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid)) {
    // Fallback: generate a simple UUID from hash
    const fallbackHex = Math.abs(hash).toString(16).padStart(8, '0').repeat(4).substring(0, 32);
    return [
      fallbackHex.substring(0, 8),
      fallbackHex.substring(8, 12),
      '4' + fallbackHex.substring(13, 16),
      '8' + fallbackHex.substring(17, 20),
      fallbackHex.substring(20, 32)
    ].join('-');
  }
  
  return uuid;
}

