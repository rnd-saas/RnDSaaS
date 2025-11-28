import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { createCheckoutSession, cancelSubscription } from '../services/paymentService';
import { supabase } from '../db/supabase';

const router = Router();

router.get('/subscription', requireAuth, async (req: any, res) => {
  try {
    const user = req.user;
    
    const { data, error } = await supabase
      .from('user_subscription')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ error: error.message });
    }

    res.json(data || null);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/create-checkout-session', requireAuth, async (req: any, res) => {
  try {
    const { priceId } = req.body;
    const user = req.user;

    if (!user || !user.email) {
      return res.status(400).json({ error: 'User email is required' });
    }

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    const session = await createCheckoutSession(user.id, user.email, priceId);

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

    await cancelSubscription(subscription.stripe_subscription_id);

    res.json({ message: 'Subscription canceled successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
