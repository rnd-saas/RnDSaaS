import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

type NavItem = {
  label: "Home" | "Workout" | "Social" | "Profile";
  to: string;
  icon: string; // keeping your emoji icons
  end?: boolean; // for exact matching on root paths
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", to: "/", icon: "🏠", end: true },
  { label: "Workout", to: "/workout", icon: "🏋️‍♀️" },
  { label: "Social", to: "/social", icon: "💬" },
  { label: "Profile", to: "/profile", icon: "👤" },
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-screen-sm items-center justify-around px-4 py-2 text-sm">
        {NAV_ITEMS.map((item) => (
          <NavTab key={item.to} {...item} />
        ))}
      </div>
    </nav>
  );
}

function NavTab({ label, to, icon, end }: NavItem) {
  return (
    <NavLink to={to} end={end} className="contents">
      {({ isActive }) => (
        <Button
          variant={isActive ? "default" : "ghost"}
          size="sm"
          className={`flex h-10 min-w-[70px] flex-col items-center gap-1 rounded-full px-3 ${
            isActive ? "" : "text-muted-foreground"
          }`}
          aria-current={isActive ? "page" : undefined}
        >
          <span className="text-xl leading-none">{icon}</span>
          <span className="text-[11px]">{label}</span>
        </Button>
      )}
    </NavLink>
  );
}
