import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type SocialSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
};

export default function SocialSearchBar({
  value,
  onChange,
  placeholder = "Type a command or search...",
  onSubmit,
}: SocialSearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="w-full">
      <div className="flex w-full items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-md">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          className="flex-1 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
