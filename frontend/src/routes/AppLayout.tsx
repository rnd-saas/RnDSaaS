import { Outlet } from "react-router-dom";
import { BottomNav } from "@/components/navigation/bottomnav";

export default function AppLayout() {
  return (
    <div className="relative min-h-[100dvh] bg-background">
      <div className="mx-auto w-full max-w-screen-sm px-4 pb-28 pt-6 sm:pb-8">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
