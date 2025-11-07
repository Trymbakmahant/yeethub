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

  try {
    // Try to get existing user by wallet address
    const response = await fetch(
      `${API_BASE_URL}/api/users?wallet_address=${encodeURIComponent(walletAddress)}`
    );

    if (response.ok) {
      const user = await response.json();
      if (user && user.id) {
        return user.id;
      }
    }

    // If not found, create new user
    const createResponse = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wallet_address: walletAddress,
      }),
    });

    if (createResponse.ok) {
      const newUser = await createResponse.json();
      if (newUser && newUser.id) {
        return newUser.id;
      }
    }

    // If user endpoints don't work, fall through to UUID generation
    console.warn('User endpoint not available or returned invalid data, generating deterministic UUID');
  } catch (error) {
    // If the endpoint doesn't exist, generate a deterministic UUID from wallet address
    console.warn('User endpoint not available, generating deterministic UUID:', error);
  }

  // Always return a deterministic UUID as fallback
  const generatedUUID = generateUUIDFromWallet(walletAddress);
  if (!generatedUUID || generatedUUID.trim() === '') {
    throw new Error('Failed to generate user UUID');
  }
  return generatedUUID;
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

