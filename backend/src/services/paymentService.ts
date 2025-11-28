import { stripe } from '../utils/stripe';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export const createCheckoutSession = async (userId: string, userEmail: string, priceId: string, referrerId?: string) => {
  try {
    // Optional: Retrieve or create customer in Stripe to link with your DB user
    // const customer = await stripe.customers.create({ email: userEmail, metadata: { userId } });

    const sessionConfig: any = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription', // or 'payment' for one-time
      subscription_data: {
        trial_period_days: 14,
      },
      success_url: `${FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/payment/cancel`,
      customer_email: userEmail,
      metadata: {
        userId,
      },
    };

    if (referrerId) {
        sessionConfig.metadata.referredBy = referrerId;
        // Apply referral coupon if configured
        if (process.env.STRIPE_REFERRAL_COUPON_ID) {
            sessionConfig.discounts = [{ coupon: process.env.STRIPE_REFERRAL_COUPON_ID }];
        }
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const cancelSubscription = async (subscriptionId: string) => {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
};
