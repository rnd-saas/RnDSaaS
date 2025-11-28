import { Button } from "@/components/ui/button.tsx";
import { useNavigate } from "react-router-dom";

export type SubscriptionSettings = {
  subscriptionType: number;
  card: string;
};

export default function SubscriptionSettings() {
  const validityDate = new Date();
  const navigate = useNavigate();

  return (
    <div className="space-y-4 w-full">
      <div className="text-sm text-muted-foreground font-sans">
        Your subscription is valid until{" "}
        <span className="font-medium text-foreground">
          {validityDate.toLocaleDateString()}
        </span>
      </div>
      <Button
        onClick={() => navigate("/")}
        className="w-full sm:w-auto font-serif text-sm"
      >
        Renew subscription
      </Button>
    </div>
  );
}
