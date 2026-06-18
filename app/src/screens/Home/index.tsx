import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import PostList from "../../components/PostList";
import { useAuth } from "../../context/AuthContext";
import { usePosts } from "../../context/PostContext";
import { RootStackParamList } from "../../navigation/types";
import styles from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const { logout } = useAuth();
  const { posts, loading, error, fetchPosts } = usePosts();

  const handleSignOut = async () => {
    await logout();
    navigation.replace("Login");
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const goToCreatePost = () => navigation.navigate("CreatePost");

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Posts</Text>
        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </View>

      <PostList
        posts={posts}
        loading={loading}
        error={error}
        onRefresh={fetchPosts}
        onRetry={fetchPosts}
        onCreatePost={goToCreatePost}
      />

      {posts.length > 0 ? (
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
          onPress={goToCreatePost}
        >
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      ) : null}
    </SafeAreaView>
  );
}
