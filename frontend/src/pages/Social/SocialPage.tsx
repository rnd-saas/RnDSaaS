import { useMemo, useState, useEffect } from "react";
import SocialSearchBar from "@/components/ui/searchbar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Heart, PlusSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock users
const MOCK_USERS = [
  { id: 1, name: "Sarah Johnson", username: "sarahj", status: "On a 10-day streak 💪" },
  { id: 2, name: "Tom Williams", username: "tomw", status: "Just finished a workout 🔥" },
  { id: 3, name: "Alex Kim", username: "alexk", status: "Trying yoga this week 🧘" },
  { id: 4, name: "Maria Rodriguez", username: "maria_r", status: "Loving morning runs 🌅" },
];

// Mock posts
const MOCK_POSTS = [
  { id: 1, user: "Sarah Johnson", emoji: "🏋️‍♀️", text: "Just finished Day 12 of my program. Feeling amazing!" },
  { id: 2, user: "Tom Williams", emoji: "🔥", text: "Best chest workout of my life today!" },
  { id: 3, user: "Alex Kim", emoji: "🧘", text: "Morning yoga really resets my mind." },
];

const LIKES_STORAGE_KEY = "social_private_likes_v1";

export default function SocialPage() {
  const [query, setQuery] = useState("");

  // ---- private likes state (local only) ----
  const [likes, setLikes] = useState<Record<number, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LIKES_STORAGE_KEY);
      if (raw) setLikes(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likes));
    } catch {}
  }, [likes]);

  const toggleLike = (postId: number) => {
    setLikes((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleSearch = () => {
    console.log("Search:", query);
  };

  const handlePostWorkout = () => {
    console.log("Post workout clicked");
  };

  // Filter users only when typing
  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return MOCK_USERS.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="w-full max-w-md min-h-[75vh] flex flex-col items-center space-y-6">

      {/* ✅ TOP ROW: search bar + post button */}
      <div className="w-full px-4 mt-4 flex items-center gap-2">
        <div className="flex-1">
          <SocialSearchBar
            value={query}
            onChange={setQuery}
            onSubmit={handleSearch}
          />
        </div>

        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={handlePostWorkout}
          className="shrink-0 rounded-xl"
          aria-label="Post workout"
          title="Post workout"
        >
          <PlusSquare className="h-5 w-5" />
        </Button>
      </div>

      {/* User results (only if typing) */}
      <div className="w-full px-4 space-y-3">
        {filteredUsers.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">Users</p>
        )}

        {filteredUsers.map((user) => (
          <button
            key={user.id}
            type="button"
            className="flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm hover:bg-accent/40 transition-colors text-left"
          >
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <span className="text-sm font-medium leading-tight">
                {user.name}
              </span>
              <span className="text-xs text-muted-foreground">
                @{user.username}
              </span>
              {user.status && (
                <span className="mt-0.5 text-xs text-muted-foreground">
                  {user.status}
                </span>
              )}
            </div>
          </button>
        ))}

        {filteredUsers.length > 0 && <div className="h-3" />}
      </div>

      {/* Posts Feed */}
      <div className="w-full px-4 space-y-4">
        <h2 className="text-lg font-semibold text-center">Recent activity</h2>

        {MOCK_POSTS.map((post) => {
          const liked = !!likes[post.id];

          return (
            <Card key={post.id} className="bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{post.emoji}</div>
                  <CardTitle className="text-base">{post.user}</CardTitle>
                </div>

                {/* Private like button (only visible to you) */}
                <button
                  type="button"
                  aria-label={liked ? "Unlike" : "Like"}
                  onClick={() => toggleLike(post.id)}
                  className="rounded-full p-2 hover:bg-accent/40 transition-colors"
                  title="Your private like"
                >
                  <Heart
                    className={`h-5 w-5 transition-colors ${
                      liked ? "fill-red-500 text-red-500" : "text-muted-foreground"
                    }`}
                  />
                </button>
              </CardHeader>

              <CardContent className="pb-4 text-sm text-muted-foreground">
                {post.text}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
