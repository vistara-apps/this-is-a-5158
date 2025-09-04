# PixelFlow API Documentation

This document outlines the API integrations and backend services used in PixelFlow.

## 🔗 API Integrations

### 1. Stability.ai API

**Base URL**: `https://api.stability.ai/v1`

#### Authentication
```javascript
headers: {
  'Authorization': `Bearer ${STABILITY_API_KEY}`,
  'Content-Type': 'application/json'
}
```

#### Generate Image
**Endpoint**: `POST /generation/stable-diffusion-v1-6/text-to-image`

**Request Body**:
```json
{
  "text_prompts": [
    {
      "text": "A beautiful sunset over mountains",
      "weight": 1
    },
    {
      "text": "blurry, low quality",
      "weight": -1
    }
  ],
  "cfg_scale": 7,
  "height": 1024,
  "width": 1024,
  "samples": 1,
  "steps": 30,
  "seed": 123456,
  "style_preset": "enhance"
}
```

**Response**:
```json
{
  "artifacts": [
    {
      "base64": "iVBORw0KGgoAAAANSUhEUgAA...",
      "seed": 123456,
      "finishReason": "SUCCESS"
    }
  ]
}
```

#### Style Presets Available
- `enhance` - General enhancement
- `anime` - Anime style
- `photographic` - Photorealistic
- `digital-art` - Digital art style
- `comic-book` - Comic book style
- `fantasy-art` - Fantasy art
- `line-art` - Line art style
- `analog-film` - Analog film look
- `neon-punk` - Cyberpunk/neon style
- `isometric` - Isometric perspective

### 2. OpenAI DALL-E API (Fallback)

**Base URL**: `https://api.openai.com/v1`

#### Authentication
```javascript
headers: {
  'Authorization': `Bearer ${OPENAI_API_KEY}`,
  'Content-Type': 'application/json'
}
```

#### Generate Image
**Endpoint**: `POST /images/generations`

**Request Body**:
```json
{
  "model": "dall-e-3",
  "prompt": "A beautiful sunset over mountains",
  "n": 1,
  "size": "1024x1024",
  "quality": "standard",
  "style": "vivid"
}
```

**Response**:
```json
{
  "created": 1589478378,
  "data": [
    {
      "url": "https://...",
      "revised_prompt": "A beautiful sunset over mountains with enhanced details..."
    }
  ]
}
```

### 3. Supabase API

**Base URL**: `https://your-project.supabase.co/rest/v1`

#### Authentication
```javascript
headers: {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${user_jwt_token}`,
  'Content-Type': 'application/json'
}
```

#### Database Schema

##### Users Table
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  credits INTEGER DEFAULT 10,
  subscription_tier TEXT DEFAULT 'free',
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

##### Generations Table
```sql
CREATE TABLE generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  negative_prompt TEXT,
  style_preset TEXT,
  image_urls TEXT[],
  settings JSONB,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

##### Presets Table
```sql
CREATE TABLE presets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  prompt_modifier TEXT,
  style_tags TEXT[],
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### API Endpoints

##### Get User Profile
```javascript
GET /users?user_id=eq.${userId}&select=*
```

##### Update User Credits
```javascript
PATCH /users?user_id=eq.${userId}
Content-Type: application/json

{
  "credits": 45
}
```

##### Save Generation
```javascript
POST /generations
Content-Type: application/json

{
  "user_id": "uuid",
  "prompt": "A beautiful sunset",
  "negative_prompt": "blurry",
  "style_preset": "photographic",
  "image_urls": ["https://..."],
  "settings": {"size": "1024x1024"},
  "status": "completed"
}
```

##### Get User Generations
```javascript
GET /generations?user_id=eq.${userId}&order=created_at.desc&limit=50
```

### 4. Stripe API

**Base URL**: `https://api.stripe.com/v1`

#### Authentication
```javascript
headers: {
  'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
  'Content-Type': 'application/x-www-form-urlencoded'
}
```

#### Subscription Plans
```javascript
const subscriptionPlans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 10,
    credits: 100,
    stripePriceId: 'price_starter_monthly'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 25,
    credits: 300,
    stripePriceId: 'price_pro_monthly'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 50,
    credits: 750,
    stripePriceId: 'price_enterprise_monthly'
  }
];
```

#### Create Checkout Session
```javascript
POST /checkout/sessions
Content-Type: application/x-www-form-urlencoded

line_items[0][price]=${priceId}&
line_items[0][quantity]=1&
mode=subscription&
success_url=${successUrl}&
cancel_url=${cancelUrl}&
customer_email=${email}
```

#### Create Customer Portal Session
```javascript
POST /billing_portal/sessions
Content-Type: application/x-www-form-urlencoded

customer=${customerId}&
return_url=${returnUrl}
```

## 🔧 Service Layer Implementation

### Stability API Service (`src/services/stabilityApi.js`)

```javascript
import axios from 'axios';

const stabilityApi = axios.create({
  baseURL: 'https://api.stability.ai/v1',
  headers: {
    'Authorization': `Bearer ${STABILITY_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const generateImage = async (prompt, options = {}) => {
  // Implementation details...
};

export const generateImageBatch = async (prompts, options = {}) => {
  // Implementation details...
};
```

### Supabase Service (`src/services/supabase.js`)

```javascript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getUserProfile = async (userId) => {
  // Implementation details...
};

export const saveGeneration = async (generation) => {
  // Implementation details...
};
```

### Stripe Service (`src/services/stripe.js`)

```javascript
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export const createCheckoutSession = async (priceId, userId) => {
  // Implementation details...
};

export const createPortalSession = async (customerId) => {
  // Implementation details...
};
```

## 🔐 Authentication Flow

### 1. User Registration
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`
  }
});
```

### 2. User Login
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

### 3. Password Reset
```javascript
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/auth/reset-password`
});
```

### 4. Session Management
```javascript
// Get current session
const { data: { session } } = await supabase.auth.getSession();

// Listen for auth changes
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (event, session) => {
    // Handle auth state changes
  }
);
```

## 📊 Error Handling

### API Error Responses

#### Stability.ai Errors
```json
{
  "id": "error_id",
  "name": "bad_request",
  "errors": ["Invalid prompt length"]
}
```

#### OpenAI Errors
```json
{
  "error": {
    "message": "Invalid request",
    "type": "invalid_request_error",
    "code": "invalid_prompt"
  }
}
```

#### Supabase Errors
```json
{
  "code": "PGRST116",
  "details": "The result contains 0 rows",
  "hint": null,
  "message": "JSON object requested, multiple (or no) rows returned"
}
```

### Error Handling Implementation

```javascript
try {
  const images = await generateImage(prompt, options);
  return images;
} catch (error) {
  if (error.response?.status === 429) {
    throw new Error('Rate limit exceeded. Please try again later.');
  } else if (error.response?.status === 401) {
    throw new Error('Invalid API key. Please check your configuration.');
  } else {
    throw new Error(error.response?.data?.message || 'Failed to generate image');
  }
}
```

## 🚀 Rate Limiting

### Stability.ai Rate Limits
- **Free Tier**: 25 requests per month
- **Paid Tier**: Varies by plan
- **Rate Limit Headers**: Check `X-RateLimit-Remaining` header

### OpenAI Rate Limits
- **Free Tier**: 5 requests per minute
- **Paid Tier**: Higher limits based on usage tier
- **Rate Limit Headers**: Check `x-ratelimit-remaining-requests` header

### Implementation
```javascript
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const generateImageBatch = async (prompts, options = {}) => {
  const results = [];
  
  for (let i = 0; i < prompts.length; i++) {
    try {
      const images = await generateImage(prompts[i], options);
      results.push({ prompt: prompts[i], images, index: i });
      
      // Add delay to respect rate limits
      if (i < prompts.length - 1) {
        await delay(1000); // 1 second delay
      }
    } catch (error) {
      results.push({ prompt: prompts[i], error: error.message, index: i });
    }
  }
  
  return results;
};
```

## 🔄 Webhook Handling

### Stripe Webhooks

Set up webhook endpoints to handle subscription events:

```javascript
// Handle successful payment
stripe.webhooks.constructEvent(
  request.body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET
);

switch (event.type) {
  case 'checkout.session.completed':
    // Add credits to user account
    break;
  case 'invoice.payment_succeeded':
    // Renew subscription
    break;
  case 'customer.subscription.deleted':
    // Handle subscription cancellation
    break;
}
```

### Required Webhook Events
- `checkout.session.completed`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## 📈 Monitoring and Analytics

### API Usage Tracking
```javascript
// Track API usage
const trackApiUsage = async (userId, apiProvider, cost) => {
  await supabase.from('api_usage').insert({
    user_id: userId,
    provider: apiProvider,
    cost: cost,
    timestamp: new Date().toISOString()
  });
};
```

### Error Logging
```javascript
// Log errors for monitoring
const logError = async (error, context) => {
  console.error('API Error:', {
    message: error.message,
    stack: error.stack,
    context: context,
    timestamp: new Date().toISOString()
  });
};
```

## 🔧 Development Tools

### Testing API Endpoints
```bash
# Test Stability.ai API
curl -X POST "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text_prompts": [{"text": "A lighthouse on a cliff", "weight": 1}],
    "cfg_scale": 7,
    "height": 1024,
    "width": 1024,
    "samples": 1,
    "steps": 30
  }'

# Test Supabase API
curl -X GET "https://your-project.supabase.co/rest/v1/users" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Environment Variables Validation
```javascript
const requiredEnvVars = [
  'VITE_STABILITY_API_KEY',
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_STRIPE_PUBLISHABLE_KEY'
];

requiredEnvVars.forEach(envVar => {
  if (!import.meta.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

---

This documentation provides a comprehensive overview of all API integrations used in PixelFlow. For specific implementation details, refer to the service files in the `src/services/` directory.
