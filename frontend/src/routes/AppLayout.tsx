import { Outlet } from "react-router-dom";
import { BottomNav } from "@/components/navigation/bottomnav";

export default function AppLayout() {
  return (
    <>
      <Outlet />
      <BottomNav />
    </>
  );
}
