import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import type { Post } from "../../types/post";
import { colors } from "src/utils/colors";
import EmptyPostList from "../EmptyPostList";
import PostListItem from "../PostListItem";
import styles from "./styles";

type PostListProps = {
  posts: Post[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onRetry: () => void;
  onCreatePost: () => void;
};

export default function PostList({
  posts,
  loading,
  error,
  onRefresh,
  onRetry,
  onCreatePost,
}: PostListProps) {
  if (loading && posts.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error && posts.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.retryButtonPressed,
          ]}
          onPress={onRetry}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PostListItem post={item} />}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
      ListEmptyComponent={<EmptyPostList onCreatePost={onCreatePost} />}
    />
  );
}
