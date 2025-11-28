import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import SocialSearchBar from "@/components/ui/searchbar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Loader2, PlusSquare, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { socialService } from "@/lib/api";
import type { FriendRelation, SocialPost, SocialUserSummary } from "@/lib/api/socialService";

const initialsFromName = (value?: string | null) =>
  (value ?? "?")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
};

export default function SocialPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 350);

  type FriendRequestVariables = {
    userId: string;
    displayName: string;
  };

  const friendRequestMutation = useMutation<FriendRelation, Error, FriendRequestVariables>({
    mutationFn: ({ userId }) => socialService.sendFriendRequest(userId),
    onSuccess: (_data, variables) => {
      toast.success("Friend request sent ✅", {
        description: `You sent a friend request to ${variables.displayName}.`,
      });
    },
    onError: (error) => {
      toast.error(error.message || "Unable to send friend request.");
    },
  });

  const {
    data: searchResults = [],
    isFetching: isSearching,
    error: searchError,
  } = useQuery<SocialUserSummary[], Error>({
    queryKey: ["social-users", debouncedQuery],
    queryFn: () => socialService.searchUsers(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 60_000,
    retry: 1,
  });

  const {
    data: posts = [],
    isLoading: postsLoading,
    isFetching: postsRefreshing,
    error: postsError,
    refetch: refetchPosts,
  } = useQuery<SocialPost[], Error>({
    queryKey: ["social-posts"],
    queryFn: socialService.getPosts,
    staleTime: 30_000,
    retry: 1,
  });

  useEffect(() => {
    if (searchError) {
      toast.error("Unable to search users right now.");
    }
  }, [searchError]);

  useEffect(() => {
    if (postsError) {
      toast.error("Unable to load the feed.");
    }
  }, [postsError]);

  const handlePostWorkout = () => {
    navigate("/social/post");
  };

  const hasQuery = debouncedQuery.trim().length > 0;
  const userResults = hasQuery ? searchResults : [];

  return (
    <div className="w-full max-w-md min-h-[75vh] flex flex-col items-center space-y-6">

      {/* ✅ TOP ROW: search bar + buttons */}
      <div className="w-full px-4 mt-4 flex items-center gap-2">
        <div className="flex-1">
          <SocialSearchBar
            value={query}
            onChange={setQuery}
          />
        </div>

        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={() => navigate("/social/manage")}
          className="shrink-0 rounded-xl"
          aria-label="Manage friends"
          title="Manage friends"
        >
          <Users className="h-5 w-5" />
        </Button>

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
        {hasQuery && (
          <p className="text-xs text-muted-foreground mt-2">Users</p>
        )}

        {hasQuery && isSearching && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Searching...
          </div>
        )}

        {hasQuery && !isSearching && userResults.length === 0 && (
          <p className="text-xs text-muted-foreground">No matches found.</p>
        )}

        {userResults.map((user) => (
          <div
            key={user.id}
            className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm hover:bg-accent/40 transition-colors"
          >
            <div className="flex items-center gap-3 text-left">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {initialsFromName(user.display_name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <span className="text-sm font-medium leading-tight">
                  {user.display_name}
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
            </div>

            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="rounded-xl shrink-0"
              onClick={() =>
                friendRequestMutation.mutate({
                  userId: user.id,
                  displayName: user.display_name,
                })
              }
              disabled={
                friendRequestMutation.isPending &&
                friendRequestMutation.variables?.userId === user.id
              }
              aria-label={`Add ${user.display_name} as friend`}
              title="Add friend"
            >
              {friendRequestMutation.isPending &&
              friendRequestMutation.variables?.userId === user.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="h-5 w-5" />
              )}
            </Button>
          </div>
        ))}

        {hasQuery && userResults.length > 0 && <div className="h-3" />}
      </div>

      {/* Posts Feed */}
      <div className="w-full px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-center">Recent activity</h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => refetchPosts()}
            disabled={postsRefreshing}
          >
            {postsRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Refresh"
            )}
          </Button>
        </div>

        {postsLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading feed...
          </div>
        )}

        {!postsLoading && posts.length === 0 && (
          <p className="text-sm text-muted-foreground text-center">
            No activity yet. Check back soon!
          </p>
        )}

        {posts.map((post) => {
          const authorName = post.author?.display_name ?? "Anonymous athlete";
          const authorHandle = post.author?.username
            ? `@${post.author.username}`
            : "";

          return (
            <Card key={post.id} className="bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {initialsFromName(authorName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base leading-tight">
                      {authorName}
                    </CardTitle>
                    {authorHandle && (
                      <p className="text-xs text-muted-foreground">{authorHandle}</p>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDate(post.created_at)}
                </span>
              </CardHeader>

              <CardContent className="pb-4 text-sm text-muted-foreground">
                {post.body}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
