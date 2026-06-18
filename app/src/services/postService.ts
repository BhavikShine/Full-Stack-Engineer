import { apiGet, apiPost } from "../config/Axios";
import { POSTS } from "../config/Axios/apis";
import { extractErrorMessage } from "../utils/apiError";
import type { Post } from "../types/post";

type ApiPost = {
  id?: string | number;
  post_id?: string;
  user_id?: string;
  title: string;
  description?: string;
  body?: string;
  content?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
};

type CreatePostPayload = {
  title: string;
};

function mapApiPost(item: ApiPost): Post {
  return {
    id: String(item.id ?? item.post_id ?? Date.now()),
    title: item.title,
    description: item.description ?? item.body ?? item.content ?? "",
    createdAt: item.created_at ?? item.createdAt ?? new Date().toISOString(),
  };
}

function normalizePostsResponse(data: unknown): Post[] {
  if (Array.isArray(data)) {
    return data.map((item) => mapApiPost(item as ApiPost));
  }

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;

    if (Array.isArray(record.data)) {
      return record.data.map((item) => mapApiPost(item as ApiPost));
    }

    if (Array.isArray(record.posts)) {
      return record.posts.map((item) => mapApiPost(item as ApiPost));
    }
  }

  return [];
}


export async function fetchPosts(): Promise<Post[]> {
  try {
    const response = await apiGet<unknown>(POSTS);
    return normalizePostsResponse(response.data);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to fetch posts."));
  }
}

export async function createPost(title: string): Promise<Post> {
  const payload: CreatePostPayload = {
    title: title.trim(),
  };

  try {
    const response = await apiPost<ApiPost>(POSTS, payload);
    return mapApiPost(response.data);
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to create post."));
  }
}
