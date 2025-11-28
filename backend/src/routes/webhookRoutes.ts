import { Router, Request, Response } from 'express';
import { stripe } from '../utils/stripe';
import { supabaseAdmin } from '../db/supabase';
import Stripe from 'stripe';

const router = Router();

// This handler assumes the request body is already parsed as Buffer or raw string if configured in app.ts
// OR we can handle the raw body extraction here if we disable body parsing for this route in app.ts
router.post('/', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      console.error('Missing Stripe signature or webhook secret');
      return res.status(400).send('Webhook Error: Missing config');
    }

    // req.body must be the raw buffer here. 
    // In app.ts, we will configure express.raw({ type: 'application/json' }) for this route
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Signature Verification Failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    console.log(`[Webhook] Received event: ${event.type}`);
    
    switch (event.type) {
      case 'checkout.session.completed': {
        console.log('[Webhook] Processing checkout.session.completed');
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }
      case 'customer.subscription.updated': {
        console.log('[Webhook] Processing customer.subscription.updated');
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }
      case 'customer.subscription.deleted': {
        console.log('[Webhook] Processing customer.subscription.deleted');
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }
      case 'invoice.payment_succeeded': {
        console.log('[Webhook] Processing invoice.payment_succeeded');
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }
      default:
        console.log(`[Webhook] Unhandled event type ${event.type}`);
    }
    res.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('[Webhook] handleCheckoutSessionCompleted started', { 
      sessionId: session.id, 
      metadata: session.metadata,
      subscription: session.subscription,
      customer: session.customer
  });

  const userId = session.metadata?.userId;
  const subscriptionId = session.subscription as string;
  const customerId = session.customer as string;

  if (!userId || !subscriptionId) {
    console.warn('[Webhook] Missing userId or subscriptionId in session metadata/object');
    return;
  }

  // Retrieve full subscription details to get period end
  console.log(`[Webhook] Retrieving subscription details for ${subscriptionId}`);
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Debug log for subscription object keys to troubleshoot missing fields
  console.log(`[Webhook] Subscription object keys: ${Object.keys(subscription).join(', ')}`);

  // Safe access to current_period_end with fallback check
  // In the log output, we see 'items' array which contains 'current_period_end'.
  // The root subscription object might not have it directly in some API versions or test modes?
  // Let's try to find it in items if missing in root.
  let currentPeriodEndTimestamp = (subscription as any).current_period_end ?? (subscription as any).currentPeriodEnd;

  if (!currentPeriodEndTimestamp && (subscription as any).items?.data?.[0]?.current_period_end) {
      currentPeriodEndTimestamp = (subscription as any).items.data[0].current_period_end;
      console.log('[Webhook] Found current_period_end in subscription items:', currentPeriodEndTimestamp);
  }

  if (!currentPeriodEndTimestamp) {
      console.error('[Webhook] Critical: current_period_end is missing. Full subscription object:', JSON.stringify(subscription, null, 2));
      // Fallback to 30 days from now to allow insertion so the user is not blocked
      console.warn('[Webhook] Using fallback date (now + 30 days) for current_period_end to ensure database insertion.');
      currentPeriodEndTimestamp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
  }

  const currentPeriodEnd = new Date(currentPeriodEndTimestamp * 1000).toISOString();

  console.log(`[Webhook] Upserting subscription for user ${userId}`, {
      status: subscription.status,
      current_period_end: currentPeriodEnd
  });

  // Check if subscription already exists for this user
  const { data: existingSub } = await supabaseAdmin
    .from('user_subscription')
    .select('id')
    .eq('user_id', userId)
    .single();

  let error;
  if (existingSub) {
      // Update existing
      const result = await supabaseAdmin
        .from('user_subscription')
        .update({
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          sub_status: subscription.status,
          current_period_end: currentPeriodEnd,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);
      error = result.error;
  } else {
      // Insert new
      const result = await supabaseAdmin
        .from('user_subscription')
        .insert({
          user_id: userId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          sub_status: subscription.status,
          current_period_end: currentPeriodEnd,
          updated_at: new Date().toISOString(),
        });
      error = result.error;
  }

  if (error) {
    console.error('[Webhook] Error upserting subscription:', error);
    throw error;
  }
  console.log(`[Webhook] Subscription created/updated successfully for user ${userId}`);

  // Handle referral reward if applicable
  await handleReferralReward(session);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // We need to find the user associated with this subscription
  // We can query by stripe_subscription_id
  
  const { data: existingSub } = await supabaseAdmin
    .from('user_subscription')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (!existingSub) {
    console.warn(`No local subscription found for Stripe ID ${subscription.id}`);
    return;
  }

  let currentPeriodEndTimestamp = (subscription as any).current_period_end ?? (subscription as any).currentPeriodEnd;
  
  if (!currentPeriodEndTimestamp) {
      console.warn(`[Webhook] current_period_end missing for subscription update ${subscription.id}. Using fallback.`);
      currentPeriodEndTimestamp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
  }

  const { error } = await supabaseAdmin
    .from('user_subscription')
    .update({
      sub_status: subscription.status,
      current_period_end: new Date(currentPeriodEndTimestamp * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
  console.log(`Subscription updated for user ${existingSub.user_id}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
   const { error } = await supabaseAdmin
    .from('user_subscription')
    .update({
      sub_status: 'canceled', // or subscription.status
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
  console.log(`Subscription canceled for Stripe ID ${subscription.id}`);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    const subscriptionId = (invoice as any).subscription;
    if (!subscriptionId) {
        console.log('[Webhook] Invoice not associated with a subscription');
        return;
    }

    // We need to find the user associated with this subscription
    const { data: existingSub } = await supabaseAdmin
        .from('user_subscription')
        .select('user_id')
        .eq('stripe_subscription_id', subscriptionId)
        .single();

    if (!existingSub) {
        console.warn(`[Webhook] No local subscription found for Stripe Subscription ID ${subscriptionId} (invoice payment)`);
        return;
    }

    // Retrieve latest subscription details to get new period end
    const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
    let currentPeriodEndTimestamp = (subscription as any).current_period_end ?? (subscription as any).currentPeriodEnd;
    
    if (!currentPeriodEndTimestamp) {
        console.warn(`[Webhook] current_period_end missing for invoice payment ${subscriptionId}. Using fallback.`);
        currentPeriodEndTimestamp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
    }

    const { error } = await supabaseAdmin
        .from('user_subscription')
        .update({
            sub_status: subscription.status,
            current_period_end: new Date(currentPeriodEndTimestamp * 1000).toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscriptionId);

    if (error) {
        console.error('[Webhook] Error updating subscription from invoice:', error);
        throw error;
    }
    console.log(`[Webhook] Subscription updated from invoice for user ${existingSub.user_id}`);
}

async function handleReferralReward(session: Stripe.Checkout.Session) {
    const referredBy = session.metadata?.referredBy;
    if (!referredBy) return;

    console.log(`[Webhook] Processing referral reward for referrer ${referredBy}`);

    // Find referrer's Stripe Customer ID
    const { data: referrerSub, error } = await supabaseAdmin
        .from('user_subscription')
        .select('stripe_customer_id')
        .eq('user_id', referredBy)
        .single();

    if (error || !referrerSub?.stripe_customer_id) {
        console.warn(`[Webhook] Referrer ${referredBy} not found or has no Stripe Customer ID`);
        return;
    }

    try {
        // Add 5 EUR credit to referrer's balance
        // Amount is in cents, so 500
        await stripe.customers.createBalanceTransaction(referrerSub.stripe_customer_id, {
            amount: -500, // Negative amount adds credit to the customer balance
            currency: 'eur',
            description: 'Referral reward',
        });
        console.log(`[Webhook] Added 5 EUR credit to referrer ${referredBy} (Customer ${referrerSub.stripe_customer_id})`);
    } catch (err: any) {
        console.error(`[Webhook] Failed to add referral credit: ${err.message}`);
    }
}

export default router;
