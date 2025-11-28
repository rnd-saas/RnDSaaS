import React, { useState } from 'react';
import { paymentService } from '@/lib/api/paymentService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/card';
import { toast } from 'sonner';

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState('');

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // Replace with your actual Stripe Price ID
      // You can find this in your Stripe Dashboard -> Products -> Pricing
      const PRICE_ID = 'price_1SYNoHGK6AjiY8KvH2XjRpfF'; 

      const response = await paymentService.createCheckoutSession(PRICE_ID, referralCode);
      
      if (response.url) {
        window.location.href = response.url;
      } else {
        toast.error('Failed to start checkout session.');
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast.error(error.message || 'Failed to start subscription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Pro Plan</CardTitle>
          <CardDescription>Unlock all features with Pro.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-4">€5.00<span className="text-sm font-normal text-muted-foreground">/month</span></div>
          <ul className="list-disc list-inside space-y-2 text-sm mb-6">
            <li>Unlimited Workouts</li>
            <li>Advanced Analytics</li>
            <li>Priority Support</li>
          </ul>
          
          <div className="space-y-2">
            <Label htmlFor="referral">Referral Code (Optional)</Label>
            <Input 
                id="referral" 
                placeholder="Enter code" 
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSubscribe} disabled={loading}>
            {loading ? 'Processing...' : 'Subscribe Now'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
