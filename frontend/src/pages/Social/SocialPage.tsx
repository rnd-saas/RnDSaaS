import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import SocialSearchBar from "@/components/ui/searchbar";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Check, Clock, Loader2, PlusSquare, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { socialService } from "@/lib/api";
import type { FriendRelation, SocialPost, SocialUserSummary } from "@/lib/api/socialService";
import {AvatarOptionValues} from "@/utils/AvatarOptionValues.tsx";

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
    <div className="w-full mx-auto w-[90vw] md:w-[75vw] lg:w-[40vw] min-h-[75vh] flex flex-col items-center mb-15 space-y-6">

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
              <Avatar>
                {user.user_info?.avatar_option != null ? (
                    <AvatarImage
                        src={AvatarOptionValues[user.user_info.avatar_option].src}
                    />
                ) : (
                    <AvatarFallback className="bg-white">
                      {initialsFromName(user.display_name)}
                    </AvatarFallback>
                )}
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

            {(() => {
              const status = user.friend_status;
              const isMutating =
                friendRequestMutation.isPending &&
                friendRequestMutation.variables?.userId === user.id;

              const handleClick = () => {
                if (status === 'accepted' || status === 'pending_outgoing') return;
                friendRequestMutation.mutate({ userId: user.id, displayName: user.display_name });
              };

              const disabled =
                isMutating || status === 'accepted' || status === 'pending_outgoing';

              const icon = isMutating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : status === 'accepted' ? (
                <Check className="h-5 w-5" />
              ) : status === 'pending_outgoing' ? (
                <Clock className="h-5 w-5" />
              ) : (
                <UserPlus className="h-5 w-5" />
              );

              const title =
                status === 'accepted'
                  ? 'Already friends'
                  : status === 'pending_outgoing'
                  ? 'Friend request sent'
                  : 'Add friend';

              const variant = status === 'accepted' ? 'outline' : 'secondary';
              const classes =
                status === 'accepted'
                  ? 'rounded-xl shrink-0 text-muted-foreground border-muted-foreground/30'
                  : status === 'pending_outgoing'
                  ? 'rounded-xl shrink-0 text-muted-foreground'
                  : 'rounded-xl shrink-0';

              return (
                <Button
                  type="button"
                  variant={variant as any}
                  size="icon"
                  className={classes}
                  onClick={handleClick}
                  disabled={disabled}
                  aria-label={title}
                  title={title}
                >
                  {icon}
                </Button>
              );
            })()}
          </div>
        ))}
        {hasQuery && (
            <div className="w-full text-left">
              <Button variant="link" className="text-sm p-0"
                      onClick={() => navigate("/settings", { state: { openAccordion: "subscription" } })}
              >
                Refer a friend
              </Button>
            </div>
        )}

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
          const authorAvatar = post.author?.user_info?.avatar_option ?? 6;
          // const authorHandle = post.author?.username
          //   ? `@${post.author.username}`
          //   : "";

          return (
            <Card key={post.id} className="bg-white hover:scale-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-15 w-15">
                    <AvatarImage src={AvatarOptionValues[authorAvatar].src}/>
                    <AvatarFallback className={"bg-primary/10"}>
                      {initialsFromName(authorName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base leading-tight">
                      {authorName}
                    </CardTitle>
                    {/*{authorHandle && (*/}
                    {/*  <p className="text-xs text-muted-foreground">{authorHandle}</p>*/}
                    {/*)}*/}
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
