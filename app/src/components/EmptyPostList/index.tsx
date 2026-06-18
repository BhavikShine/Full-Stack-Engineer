import { Pressable, Text, View } from "react-native";
import styles from "./styles";

type EmptyPostListProps = {
  onCreatePost: () => void;
};

export default function EmptyPostList({ onCreatePost }: EmptyPostListProps) {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>📝</Text>
      </View>
      <Text style={styles.title}>No posts yet</Text>
      <Text style={styles.subtitle}>
        Create your first post to see it appear here.
      </Text>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={onCreatePost}
      >
        <Text style={styles.buttonText}>Create Post</Text>
      </Pressable>
    </View>
  );
}
