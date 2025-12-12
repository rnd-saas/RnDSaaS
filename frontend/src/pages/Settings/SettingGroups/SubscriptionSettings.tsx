import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentService } from '@/lib/api/paymentService';
import { authService } from '@/lib/api/authService';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { trackFriendInviteShared } from '@/lib/analytics';

export type SubscriptionSettings = {
    subscriptionType:number,
    card:string
}

export default function SubscriptionSettings() {
    const [subscription, setSubscription] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [canceling, setCanceling] = useState(false);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const [subData, userData] = await Promise.all([
                paymentService.getSubscriptionStatus(),
                authService.getCurrentUser()
            ]);
            setSubscription(subData);
            setUser(userData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCancelSubscription = async () => {
        if (!confirm('Are you sure you want to cancel your subscription?')) return;
        
        setCanceling(true);
        try {
            await paymentService.cancelSubscription();
            // Refresh subscription status
            const subData = await paymentService.getSubscriptionStatus();
            setSubscription(subData);
        } catch (error) {
            console.error('Failed to cancel subscription:', error);
            alert('Failed to cancel subscription. Please try again.');
        } finally {
            setCanceling(false);
        }
    };

    const copyReferralCode = () => {
        if (user?.referral_code) {
            navigator.clipboard.writeText(user.referral_code);
            trackFriendInviteShared('copy', user.referral_code);
            toast.success("Referral code copied to clipboard!");
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
        <div className="space-y-6">
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

            {user?.referral_code && (
                <div className="p-4 border rounded-lg bg-card text-card-foreground">
                    <h3 className="font-semibold mb-2">Referral Program</h3>
                    <div className="flex flex-col gap-4">
                        <p className="text-sm text-muted-foreground">
                            Share your referral code with friends. When they subscribe, you get €5 credit towards your next bill!
                        </p>
                        <div className="flex items-center gap-2 p-3 bg-secondary/20 rounded-md border border-secondary w-fit">
                            <code className="text-lg font-bold tracking-wider">{user.referral_code}</code>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyReferralCode}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                        
                        {subscription?.customerBalance > 0 && (
                            <div className="mt-2 p-3 bg-green-500/10 border border-green-500/20 rounded-md">
                                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                                    You have €{(subscription.customerBalance / 100).toFixed(2)} credit available!
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    This credit will be automatically applied to your next invoice.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}