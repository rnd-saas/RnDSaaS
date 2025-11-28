

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentService } from '@/lib/api/paymentService';
import { Button } from '@/components/ui/button';

export type SubscriptionSettings = {
    subscriptionType:number,
    card:string
}

export default function SubscriptionSettings() {
    const [subscription, setSubscription] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [canceling, setCanceling] = useState(false);
    const navigate = useNavigate();

    const fetchSubscription = async () => {
        try {
            const data = await paymentService.getSubscriptionStatus();
            setSubscription(data);
        } catch (error) {
            console.error('Failed to fetch subscription:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscription();
    }, []);

    const handleCancelSubscription = async () => {
        if (!confirm('Are you sure you want to cancel your subscription?')) return;
        
        setCanceling(true);
        try {
            await paymentService.cancelSubscription();
            // Refresh subscription status
            await fetchSubscription();
        } catch (error) {
            console.error('Failed to cancel subscription:', error);
            alert('Failed to cancel subscription. Please try again.');
        } finally {
            setCanceling(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const isPremium = subscription && (
        subscription.sub_status === 'active' || 
        subscription.sub_status === 'trialing' || 
        (subscription.sub_status === 'canceled' && new Date(subscription.current_period_end) > new Date())
    );

    const isCanceled = subscription?.sub_status === 'canceled';

    return (
        <div className="space-y-4">
            {isPremium ? (
                <div className="p-4 border rounded-lg bg-card text-card-foreground">
                    <h3 className="font-semibold mb-2">Premium Membership</h3>
                    <p className="mb-4">
                        {isCanceled 
                            ? `Your premium membership expires on ${new Date(subscription.current_period_end).toLocaleDateString()}`
                            : `Your premium membership renews on ${new Date(subscription.current_period_end).toLocaleDateString()}`
                        }
                    </p>
                    
                    {isCanceled ? (
                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-muted-foreground">
                                You have canceled your subscription. You can resubscribe to continue enjoying premium features after your current period ends.
                            </p>
                            <div className="flex justify-end">
                                <Button onClick={() => navigate('/subscription')}>
                                    Resubscribe Now
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-end">
                            <Button 
                                variant="secondary" 
                                onClick={handleCancelSubscription}
                                disabled={canceling}
                            >
                                {canceling ? 'Canceling...' : 'Cancel Subscription'}
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="p-4 border rounded-lg bg-card text-card-foreground">
                    <h3 className="font-semibold mb-2">Free Plan</h3>
                    <p className="mb-4 text-muted-foreground">
                        {isCanceled 
                            ? "Your subscription has expired. Resubscribe to regain access to premium features."
                            : "Subscribe to our premium membership and unlock all the features sort of things"}
                    </p>
                    <div className="flex justify-end">
                        <Button onClick={() => navigate('/subscription')}>
                            {isCanceled ? "Resubscribe Now" : "Subscribe Now"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}