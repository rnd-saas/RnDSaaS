import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label.tsx";

// SVGs as React components (Vite + svgr)
import { HomeIcon } from "lucide-react";
import { ContactRound } from "lucide-react";
import { UserRound } from "lucide-react";
import { ChartColumnIncreasing } from "lucide-react";
import { DumbbellIcon } from "lucide-react";

type NavItem = {
  to: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  end?: boolean;
  description: string;
};

const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", icon: HomeIcon, end: true, description: "Home" },
  { to: "/social", icon: ContactRound, description: "Social" },
  { to: "/workout", icon: DumbbellIcon, description: "Workout" },
  { to: "/progress", icon: ChartColumnIncreasing, description: "Progress" },
  { to: "/profile", icon: UserRound, description: "Profile" },
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border/40 bg-background/80 backdrop-blur-md shadow-[0_-1px_3px_rgba(0,0,0,0.05)] supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-screen-sm items-center justify-around px-6 py-1">
        {NAV_ITEMS.map((item) => (
          <NavTab key={item.to} {...item} />
        ))}
      </div>
    </nav>
  );
}

function NavTab({ to, icon: Icon, end, description }: NavItem) {
  return (
    <div>
      <NavLink to={to} end={end} className="contents">
        {({ isActive }) => (
          <Button
            variant={isActive ? "default" : "ghost"}
            size="icon"
            className={`h-8 w-8 rounded-2xl flex items-center justify-center ${
              isActive ? "" : "text-zinc-500"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className={"h-4! w-4!"} />
          </Button>
        )}
      </NavLink>
      <Label className={"text-[var(--color-grey-text)]"}>{description}</Label>
    </div>
  );
}
