import { useState } from "react";
import SocialSearchBar from "@/components/ui/searchbar";

export default function SocialPage() {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    // later: call backend / filter list
    console.log("Search:", query);
  };

  return (
    <div className="w-full max-w-md min-h-[75vh] min-w-[30vw] flex flex-col items-center space-y-6">
      <div className="w-full px-4 mt-4 mb-6">
        <SocialSearchBar
          value={query}
          onChange={setQuery}
          onSubmit={handleSearch}
        />
      </div>

      {/* rest of social page content here */}
    </div>
  );
}
