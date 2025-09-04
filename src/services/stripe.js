import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const subscriptionPlans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 10,
    credits: 100,
    features: [
      '100 image generations per month',
      'Standard quality images',
      'Basic style presets',
      'Email support'
    ],
    stripePriceId: 'price_starter_monthly'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 25,
    credits: 300,
    features: [
      '300 image generations per month',
      'High quality images',
      'All style presets',
      'Batch generation',
      'Priority support'
    ],
    stripePriceId: 'price_pro_monthly',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 50,
    credits: 750,
    features: [
      '750 image generations per month',
      'Ultra high quality images',
      'Custom style presets',
      'API access',
      'Dedicated support'
    ],
    stripePriceId: 'price_enterprise_monthly'
  }
];

export const createCheckoutSession = async (priceId, userId) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        successUrl: `${window.location.origin}/account?success=true`,
        cancelUrl: `${window.location.origin}/account?canceled=true`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();
    
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Stripe checkout error:', error);
    throw error;
  }
};

export const createPortalSession = async (customerId) => {
  try {
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl: `${window.location.origin}/account`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create portal session');
    }

    const { url } = await response.json();
    window.location.href = url;
  } catch (error) {
    console.error('Stripe portal error:', error);
    throw error;
  }
};

export const purchaseCredits = async (creditPackage, userId) => {
  try {
    const response = await fetch('/api/purchase-credits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        creditPackage,
        userId,
        successUrl: `${window.location.origin}/account?credits=true`,
        cancelUrl: `${window.location.origin}/account?canceled=true`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to purchase credits');
    }

    const { sessionId } = await response.json();
    
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Credit purchase error:', error);
    throw error;
  }
};

export const creditPackages = [
  {
    id: 'credits_50',
    name: '50 Credits',
    credits: 50,
    price: 5,
    stripePriceId: 'price_credits_50'
  },
  {
    id: 'credits_100',
    name: '100 Credits',
    credits: 100,
    price: 9,
    stripePriceId: 'price_credits_100',
    popular: true
  },
  {
    id: 'credits_250',
    name: '250 Credits',
    credits: 250,
    price: 20,
    stripePriceId: 'price_credits_250'
  },
  {
    id: 'credits_500',
    name: '500 Credits',
    credits: 500,
    price: 35,
    stripePriceId: 'price_credits_500'
  }
];
