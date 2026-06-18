// @refresh reset
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import * as postService from "../services/postService";
import type { Post } from "../types/post";

type PostContextType = {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  addPost: (title: string) => Promise<void>;
};

const PostContext = createContext<PostContextType | null>(null);

export function PostProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await postService.fetchPosts();
      setPosts(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load posts. Pull to refresh.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const addPost = useCallback(async (title: string) => {
    const newPost = await postService.createPost(title);
    setPosts((prev) => [newPost, ...prev]);
  }, []);

  return (
    <PostContext.Provider
      value={{ posts, loading, error, fetchPosts, addPost }}
    >
      {children}
    </PostContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostProvider");
  }
  return context;
}
