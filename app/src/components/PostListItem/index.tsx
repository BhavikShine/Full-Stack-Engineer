import { Text, View } from "react-native";
import type { Post } from "../../types/post";
import { formatDate } from "../../utils/formatDate";
import styles from "./styles";

type PostListItemProps = {
  post: Post;
};

export default function PostListItem({ post }: PostListItemProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title} numberOfLines={2}>
        {post.title}
      </Text>
      {post.description ? (
        <Text style={styles.description} numberOfLines={4}>
          {post.description}
        </Text>
      ) : null}
      <Text style={styles.date}>{formatDate(post.createdAt)}</Text>
    </View>
  );
}
