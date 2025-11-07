# x402 Wrapper API - Frontend Integration Guide v2.0

**Updated with Auto-Assigned Subdomains Feature**

Complete integration guide for frontend developers to integrate with the x402 Wrapper API Service.

## 🆕 What's New

- **Auto-Assigned Clean Subdomains**: APIs automatically get professional subdomains like `api-abc12345.yourdomain.com`
- **subdomain_url Field**: API responses include ready-to-use subdomain URLs
- **Native SOL Support**: Full support for native SOL token payments
- **Improved Examples**: Updated code examples with subdomain usage

## Quick Start

### 1. Create API (Gets Auto-Assigned Subdomain)

```typescript
const api = await fetch('https://yourdomain.com/api/apis', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: 'user-id',
    name: 'My API',
    original_url: 'https://api.example.com',
    price_per_request: 0.001,
    spl_token_mint: 'So11111111111111111111111111111111111111112', // Native SOL
    network: 'devnet'
    // No custom_subdomain - will get auto-assigned!
  })
}).then(r => r.json());

// api.subdomain_url = "https://api-abc12345.yourdomain.com"
```

### 2. Use Subdomain URL

```typescript
// Access API using subdomain URL
const response = await fetch(`${api.subdomain_url}/posts/1`);

if (response.status === 402) {
  // Handle payment...
}
```

That's it! Your API now has a clean, professional subdomain URL.

## Key Features

- ✅ **Auto-Assigned Subdomains**: Get clean URLs automatically
- ✅ **Pay-per-request**: x402 payment integration
- ✅ **Any SPL Token**: Support for USDC, SOL, meme coins, etc.
- ✅ **Real-time Analytics**: Track usage and revenue
- ✅ **5% Service Fee**: Automatic fee handling

## Table of Contents

1. [Overview](#overview)
2. [Subdomain Features](#subdomain-features)
3. [API Endpoints](#api-endpoints)
4. [Payment Flow](#payment-flow)
5. [Code Examples](#code-examples)
6. [TypeScript Types](#typescript-types)
7. [Best Practices](#best-practices)

## Overview

The x402 Wrapper API Service wraps your existing APIs with payment functionality. When you create an API, you automatically get a clean subdomain URL that you can use to access it.

## Subdomain Features

### Auto-Assigned Subdomains

When creating an API without a custom subdomain, you automatically get:

- **Format**: `api-{8charId}.yourdomain.com`
- **Example**: `api-abc12345.yourdomain.com`
- **Unique**: Guaranteed unique
- **No Setup**: No DNS configuration needed

### API Response

```json
{
  "id": "api-uuid",
  "name": "My API",
  "service_subdomain": "api-abc12345",
  "service_domain": "yourdomain.com",
  "subdomain_url": "https://api-abc12345.yourdomain.com",
  "price_per_request": 0.001,
  ...
}
```

### Using Subdomain URLs

```typescript
// After creating API
const api = await createApi({...});

// Use subdomain_url directly
fetch(`${api.subdomain_url}/posts/1`);

// Or construct manually
const url = `https://${api.service_subdomain}.${api.service_domain}/posts/1`;
```

## API Endpoints

### Create API

```http
POST /api/apis
Content-Type: application/json

{
  "user_id": "user-uuid",
  "name": "My API",
  "original_url": "https://api.example.com",
  "price_per_request": 0.001,
  "spl_token_mint": "So11111111111111111111111111111111111111112",
  "network": "devnet"
}
```

**Response:**
```json
{
  "id": "api-uuid",
  "subdomain_url": "https://api-abc12345.yourdomain.com",
  "service_subdomain": "api-abc12345",
  "service_domain": "yourdomain.com",
  ...
}
```

## Payment Flow

### Using Subdomain URL

```typescript
// 1. Request API
const response = await fetch('https://api-abc12345.yourdomain.com/posts/1');

// 2. Check for payment requirement
if (response.status === 402) {
  const paymentInfo = await response.json();
  
  // 3. Make payment
  const tx = await makePayment(paymentInfo.payment);
  
  // 4. Retry with payment
  const paidResponse = await fetch(
    'https://api-abc12345.yourdomain.com/posts/1',
    {
      headers: {
        'X-PAYMENT': JSON.stringify({
          transaction: tx,
          amount: paymentInfo.payment.amount,
          token: paymentInfo.payment.token,
        }),
      },
    }
  );
  
  const data = await paidResponse.json();
}
```

## Code Examples

### Complete Integration

```typescript
// 1. Create API
const api = await apiManagement.create({
  user_id: 'user-id',
  name: 'My API',
  original_url: 'https://jsonplaceholder.typicode.com',
  price_per_request: 0.001,
  spl_token_mint: 'So11111111111111111111111111111111111111112',
  network: 'devnet'
});

// 2. Use subdomain URL
const data = await wrappedApi.requestViaSubdomain(
  api.subdomain_url!,
  '/posts/1',
  {},
  handlePayment
);
```

### React Hook

```typescript
const { request, loading, error } = useWrappedApi(api.subdomain_url!);
const data = await request('/posts/1', {}, handlePayment);
```

## TypeScript Types

```typescript
export interface Api {
  id: string;
  service_subdomain?: string | null;
  service_domain?: string | null;
  subdomain_url?: string;  // Ready-to-use URL
  custom_subdomain?: string | null;
  custom_domain?: string | null;
  // ... other fields
}
```

## Best Practices

1. **Use Subdomain URLs**: Prefer `subdomain_url` over path-based access
2. **Store subdomain_url**: Save it for future API calls
3. **Handle 402 Gracefully**: Show payment UI when needed
4. **Cache Payment Info**: Store payment requirements to avoid repeated 402s

## Support

- **API Docs**: `https://yourdomain.com/api-docs`
- **Health Check**: `https://yourdomain.com/health`

---

**Ready to integrate?** Start with the Quick Start section above!

