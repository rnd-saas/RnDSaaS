import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import BackButton from "@/components/backButton";
import { Card, CardContent } from "@/components/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { socialService, authService } from "@/lib/api";
import type { FriendRequestWithUsers } from "@/lib/api/socialService";
import { Loader2, CheckCircle2, Clock, Check, X } from "lucide-react";
import { toast } from "sonner";

const initialsFromName = (value?: string | null) =>
  (value ?? "?")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function SocialManageFriendsPage() {
  const queryClient = useQueryClient();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get current user ID
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user?.id) {
          setCurrentUserId(user.id);
        }
      } catch (error) {
        console.error("Failed to get current user", error);
      }
    };
    fetchCurrentUser();
  }, []);

  const {
    data: friendRequests = [],
    isLoading: isLoadingRequests,
    error: requestsError,
  } = useQuery({
    queryKey: ["friend-requests"],
    queryFn: socialService.getFriendRequests,
    staleTime: 30_000,
    retry: 1,
  });

  const {
    data: friends = [],
    isLoading: isLoadingFriends,
    error: friendsError,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: socialService.getFriends,
    staleTime: 30_000,
    retry: 1,
  });

  const isLoading = isLoadingRequests || isLoadingFriends;
  const error = requestsError || friendsError;

  const acceptMutation = useMutation({
    mutationFn: (requestId: string) => socialService.acceptFriendRequest(requestId),
    onSuccess: () => {
      toast.success("Friend request accepted!", {
        description: "You are now friends.",
      });
      queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });
    },
    onError: (error: any) => {
      toast.error("Failed to accept friend request", {
        description: error?.message || "Please try again.",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (requestId: string) => socialService.rejectFriendRequest(requestId),
    onSuccess: () => {
      toast.success("Friend request rejected");
      queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
    },
    onError: (error: any) => {
      toast.error("Failed to reject friend request", {
        description: error?.message || "Please try again.",
      });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (requestId: string) => socialService.cancelFriendRequest(requestId),
    onSuccess: () => {
      toast.success("Friend request cancelled");
      queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
    },
    onError: (error: any) => {
      toast.error("Failed to cancel friend request", {
        description: error?.message || "Please try again.",
      });
    },
  });

  if (error) {
    toast.error("Failed to load friend requests");
  }

  // Separate requests by status and direction
  const sentRequests = friendRequests.filter(
    (req) => req.status === "pending" && req.requester_id === currentUserId
  );
  const receivedRequests = friendRequests.filter(
    (req) => req.status === "pending" && req.addressee_id === currentUserId
  );

  const getOtherUser = (request: FriendRequestWithUsers) => {
    if (!currentUserId) return request.requester || request.addressee;
    // Return the user who is not the current user
    if (request.requester?.id === currentUserId) {
      return request.addressee;
    }
    return request.requester;
  };

  // const getStatusIcon = (status: string) => {
  //   switch (status) {
  //     case "accepted":
  //       return <CheckCircle2 className="h-4 w-4 text-green-600" />;
  //     case "pending":
  //       return <Clock className="h-4 w-4 text-amber-600" />;
  //     case "blocked":
  //       return <UserX className="h-4 w-4 text-red-600" />;
  //     default:
  //       return null;
  //   }
  // };

  const getStatusLabel = (status: string, isRequester: boolean) => {
    switch (status) {
      case "accepted":
        return "Accepted";
      case "pending":
        return isRequester ? "Pending" : "Waiting for your response";
      case "blocked":
        return "Blocked";
      default:
        return status;
    }
  };

  return (
    <div className="w-full max-w-md min-h-[75vh] flex flex-col mx-auto px-4 py-3 space-y-4 pb-20">
      {/* Header */}
      <header className="flex items-start gap-3">
        <BackButton />
        <div className="flex-1 min-w-0">
          <h1 className="!text-[15px] font-semibold tracking-tight whitespace-nowrap">Manage Friends</h1>
          <p className="text-xs text-muted-foreground mt-2">
            View and manage your friend requests
          </p>
        </div>
      </header>

      <Separator className="my-2" />

      {isLoading && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-8">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading friend requests...
        </div>
      )}

      {!isLoading && receivedRequests.length === 0 && sentRequests.length === 0 && friends.length === 0 && (
        <Card className="bg-muted/10 hover:scale-none !py-3">
          <CardContent className="pt-3 pb-3 text-center !px-4">
            <p className="text-sm text-muted-foreground">
              No friend requests yet. Start by searching for users and sending friend requests!
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && (receivedRequests.length > 0 || sentRequests.length > 0 || friends.length > 0) && (
        <div className="space-y-6">
          {/* Received Requests (Pending) */}
          {receivedRequests.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                Received Requests ({receivedRequests.length})
              </h2>
              {receivedRequests.map((request) => {
                const otherUser = request.requester;
                if (!otherUser) return null;
                const isAccepting = acceptMutation.isPending && acceptMutation.variables === request.id;
                const isRejecting = rejectMutation.isPending && rejectMutation.variables === request.id;
                const isProcessing = isAccepting || isRejecting;

                return (
                  <Card key={request.id} className="bg-white hover:scale-none shadow-sm !py-2">
                    <CardContent className="pt-2 pb-2 !px-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Avatar className="h-10 w-10 shrink-0">
                            <AvatarImage src={undefined} alt={otherUser.display_name} />
                            <AvatarFallback className={"bg-primary/10"}>
                              {initialsFromName(otherUser.display_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-sm font-medium truncate">
                              {otherUser.display_name}
                            </span>
                            {/*<span className="text-xs text-muted-foreground truncate">*/}
                            {/*  @{otherUser.username}*/}
                            {/*</span>*/}
                            <div className="flex items-center gap-1 mt-1">
                              {/*{getStatusIcon(request.status)}*/}
                              <span className="text-xs text-muted-foreground">
                                {getStatusLabel(request.status, false)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rejectMutation.mutate(request.id)}
                            disabled={isProcessing}
                            className="rounded-xl h-6 w-17"
                          >
                            {isRejecting ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <X className="h-3.5 w-3.5" />
                            )}
                            <span className="text-xs">Reject</span>
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => acceptMutation.mutate(request.id)}
                            disabled={isProcessing}
                            className="rounded-xl h-6 w-17"
                          >
                            {isAccepting ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                <span className="text-xs">Accepting...</span>
                              </>
                            ) : (
                              <>
                                <Check className="h-3.5 w-3.5" />
                                <span className="text-xs">Accept</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {receivedRequests.length === 0 && (
                <Card className="bg-muted/40 hover:scale-none !py-3">
                  <CardContent className="pt-3 pb-3 text-center !px-4">
                    <p className="text-xs text-muted-foreground">
                      No received friend requests.
                    </p>
                  </CardContent>
                </Card>
              )}
            </section>
          )}

          {/* Sent Requests (Pending) */}
          {sentRequests.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                Sent Requests ({sentRequests.length})
              </h2>
              {sentRequests.map((request) => {
                const otherUser = getOtherUser(request);
                if (!otherUser) return null;
                const isCancelling = cancelMutation.isPending && cancelMutation.variables === request.id;

                return (
                  <Card key={request.id} className="bg-white hover:scale-none shadow-sm !py-2">
                    <CardContent className="pt-2 pb-2 !px-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Avatar className="h-10 w-10 shrink-0">
                            <AvatarImage src={undefined} alt={otherUser.display_name} />
                            <AvatarFallback className={"bg-primary/10"}>
                              {initialsFromName(otherUser.display_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-sm font-medium truncate">
                              {otherUser.display_name}
                            </span>
                            {/*<span className="text-xs text-muted-foreground truncate">*/}
                            {/*  @{otherUser.username}*/}
                            {/*</span>*/}
                            <div className="flex items-center gap-1 mt-1">
                              {/*{getStatusIcon(request.status)}*/}
                              <span className="text-xs text-muted-foreground">
                                {getStatusLabel(request.status, true)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => cancelMutation.mutate(request.id)}
                          disabled={isCancelling}
                          className="rounded-xl h-6 w-17"
                        >
                          {isCancelling ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              <span className="text-xs">Cancelling...</span>
                            </>
                          ) : (
                            <>
                              <X className="h-3.5 w-3.5" />
                              <span className="text-xs">Cancel</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {sentRequests.length === 0 && (
                <Card className="bg-muted/40 hover:scale-none !py-3">
                  <CardContent className="pt-3 pb-3 text-center !px-4">
                    <p className="text-xs text-muted-foreground">
                      No pending sent requests.
                    </p>
                  </CardContent>
                </Card>
              )}
            </section>
          )}

          {/* Accepted Friends */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Friends ({friends.length})
            </h2>
            {friends.length > 0 ? (
              friends.map((request) => {
                const otherUser = getOtherUser(request);
                if (!otherUser) return null;

                return (
                  <Card key={request.id} className="bg-white hover:scale-none shadow-sm !py-2">
                    <CardContent className="pt-2 pb-2 !px-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Avatar className="h-10 w-10 shrink-0">
                            <AvatarImage src={undefined} alt={otherUser.display_name} />
                            <AvatarFallback className={"bg-primary/10"}>
                              {initialsFromName(otherUser.display_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-sm font-medium truncate">
                              {otherUser.display_name}
                            </span>
                            {/*<span className="text-xs text-muted-foreground truncate">*/}
                            {/*  @{otherUser.username}*/}
                            {/*</span>*/}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="bg-muted/10 hover:scale-none !py-3">
                <CardContent className="pt-3 pb-3 text-center !px-4">
                  <p className="text-xs text-left text-muted-foreground">
                    You don't have any friends yet. Start by sending friend requests to other users!
                  </p>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

