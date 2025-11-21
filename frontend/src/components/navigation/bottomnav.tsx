import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

// SVGs as React components (Vite + svgr)
import HomeIcon from "@/components/navigation/home-icon.svg?react";
import WorkoutIcon from "@/components/navigation/workout-icon.svg?react";
import FriendsIcon from "@/components/navigation/social-icon.svg?react";
import ProfileIcon from "@/components/navigation/profile-icon.svg?react";

type NavItem = {
  to: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  end?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", icon: HomeIcon, end: true },
  { to: "/workout", icon: WorkoutIcon },
  { to: "/social", icon: FriendsIcon },
  { to: "/profile", icon: ProfileIcon },
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-screen-sm items-center justify-around px-6 py-3">
        {NAV_ITEMS.map((item) => (
          <NavTab key={item.to} {...item} />
        ))}
      </div>
    </nav>
  );
}

function NavTab({ to, icon: Icon, end }: NavItem) {
  return (
    <NavLink to={to} end={end} className="contents">
      {({ isActive }) => (
        <Button
          variant={isActive ? "default" : "ghost"}
          size="icon"
          className={`h-12 w-12 rounded-full flex items-center justify-center ${
            isActive ? "" : "text-muted-foreground"
          }`}
          aria-current={isActive ? "page" : undefined}
        >
          <Icon className="h-9 w-9" />
        </Button>
      )}
    </NavLink>
  );
}
