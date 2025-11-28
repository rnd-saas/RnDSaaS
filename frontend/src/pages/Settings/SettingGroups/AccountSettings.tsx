import { Button } from "@/components/ui/button.tsx";

export default function AccountSettings() {
  return (
    <div className="space-y-2 w-full flex flex-col items-start">
      <Button
        id="logout"
        variant="link"
        className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground font-serif"
      >
        Log out
      </Button>
      <Button
        id="delete-account"
        variant="link"
        className="h-auto p-0 text-sm text-destructive hover:text-destructive/80 font-serif"
      >
        Delete account
      </Button>
    </div>
  );
}
