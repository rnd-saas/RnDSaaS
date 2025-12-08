import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { createCheckoutSession, cancelSubscription } from '../services/paymentService';
import { supabase } from '../db/supabase';
import { stripe } from '../utils/stripe';

const router = Router();

router.get('/subscription', requireAuth, async (req: any, res) => {
  try {
    const user = req.user;
    
    const { data: subscription, error } = await supabase
      .from('user_subscription')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ error: error.message });
    }

    let customerBalance = 0;
    if (subscription?.stripe_customer_id) {
        try {
            const customer = await stripe.customers.retrieve(subscription.stripe_customer_id) as any;
            if (customer && !customer.deleted) {
                // Stripe balance: negative means credit (money user has), positive means debit (money user owes)
                // We want to show credit as a positive number to the user
                customerBalance = -(customer.balance || 0); 
            }
        } catch (err) {
            console.error('Failed to fetch stripe customer balance:', err);
        }
    }

    res.json({
        ...subscription,
        customerBalance // Amount in cents
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/create-checkout-session', requireAuth, async (req: any, res) => {
  try {
    const { priceId, referralCode, origin } = req.body;
    const user = req.user;

    if (!user || !user.email) {
      return res.status(400).json({ error: 'User email is required' });
    }

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    let referrerId: string | undefined;

    if (referralCode) {
        // Find referrer by code
        const { data: referrer, error } = await supabase
            .from('users')
            .select('id')
            .eq('referral_code', referralCode)
            .single();
        
        if (referrer && !error) {
            // Prevent self-referral
            if (referrer.id === user.id) {
                return res.status(400).json({ error: 'You cannot use your own referral code' });
            }
            referrerId = referrer.id;
        } else {
             return res.status(400).json({ error: 'Invalid referral code' });
        }
    }

    // Check if user has ever subscribed before to determine trial eligibility
    const { data: existingSub } = await supabase
        .from('user_subscription')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
    
    const allowTrial = !existingSub;

    const session = await createCheckoutSession(user.id, user.email, priceId, referrerId, origin, allowTrial);

    res.json({ url: session.url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/cancel-subscription', requireAuth, async (req: any, res) => {
  try {
    const user = req.user;

    // Get subscription ID from DB
    const { data: subscription, error } = await supabase
      .from('user_subscription')
      .select('stripe_subscription_id')
      .eq('user_id', user.id)
      .single();

    if (error || !subscription?.stripe_subscription_id) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    try {
        await cancelSubscription(subscription.stripe_subscription_id);
        res.json({ message: 'Subscription canceled successfully' });
    } catch (err: any) {
        // If subscription is missing in Stripe (404), treat it as already canceled
        if (err.statusCode === 404 || err.code === 'resource_missing') {
            console.warn(`Subscription ${subscription.stripe_subscription_id} not found in Stripe. Marking as canceled locally.`);
            
            await supabase
                .from('user_subscription')
                .update({ 
                    sub_status: 'canceled',
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', user.id);

            return res.json({ message: 'Subscription canceled successfully (synced)' });
        }
        throw err;
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
