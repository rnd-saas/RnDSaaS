import apiClient from "./client";

export interface SocialUserSummary {
  id: string;
  username: string;
  display_name: string;
  status?: string | null;
}

export interface SocialPostAuthor {
  id: string;
  username: string;
  display_name: string;
}

export interface SocialPost {
  id: string;
  body: string;
  created_at: string;
  author: SocialPostAuthor | null;
}

export type FriendStatus = "pending" | "accepted" | "blocked";

export interface FriendRelation {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: FriendStatus;
  created_at: string;
  updated_at: string;
  requester?: SocialUserSummary;
  addressee?: SocialUserSummary;
}

export interface FriendRequestWithUsers extends FriendRelation {
  requester: SocialUserSummary;
  addressee: SocialUserSummary;
}

export async function searchUsers(query: string): Promise<SocialUserSummary[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  return apiClient.get<SocialUserSummary[]>("/api/social/users", { q: trimmed });
}

export async function getPosts(): Promise<SocialPost[]> {
  return apiClient.get<SocialPost[]>("/api/social/posts");
}

export async function createPost(body: string): Promise<SocialPost> {
  const trimmed = body.trim();
  if (!trimmed) {
    throw new Error("Post body cannot be empty");
  }
  if (trimmed.length > 280) {
    throw new Error("Post body must be 280 characters or less");
  }
  return apiClient.post<SocialPost>("/api/social/posts", { body: trimmed });
}

export async function getFriendRequests(): Promise<FriendRequestWithUsers[]> {
  return apiClient.get<FriendRequestWithUsers[]>("/api/social/friends");
}

export async function sendFriendRequest(targetUserId: string): Promise<FriendRelation> {
  return apiClient.post<FriendRelation>("/api/social/friends", { targetUserId });
}

export async function acceptFriendRequest(requestId: string): Promise<FriendRequestWithUsers> {
  return apiClient.patch<FriendRequestWithUsers>(`/api/social/friends/${requestId}/accept`);
}

export async function rejectFriendRequest(requestId: string): Promise<{ success: boolean; message: string }> {
  return apiClient.patch<{ success: boolean; message: string }>(`/api/social/friends/${requestId}/reject`);
}

export async function cancelFriendRequest(requestId: string): Promise<{ success: boolean; message: string }> {
  return apiClient.delete<{ success: boolean; message: string }>(`/api/social/friends/${requestId}`);
}

export async function getFriends(): Promise<FriendRequestWithUsers[]> {
  return apiClient.get<FriendRequestWithUsers[]>("/api/social/friends/accepted");
}
