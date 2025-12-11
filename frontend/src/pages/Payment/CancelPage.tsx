import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/card';
import { XCircle } from 'lucide-react';
import { trackPaymentCancel } from '@/lib/analytics';

export default function PaymentCancelPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Track payment cancellation
    trackPaymentCancel();
  }, []);

  return (
    <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
      <Card className="w-[350px] text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle>Payment Cancelled</CardTitle>
          <CardDescription>Your subscription process was cancelled.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No charges were made. You can try again whenever you're ready.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-2">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
          <Button onClick={() => navigate('/subscription')}>
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
