import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { usePosts } from "../../context/PostContext";
import { RootStackParamList } from "../../navigation/types";
import { colors } from "src/utils/colors";
import styles from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "CreatePost">;

const TITLE_MAX_LENGTH = 60;

export default function CreatePostScreen({ navigation }: Props) {
  const { addPost } = usePosts();
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!title.trim()) {
      setError("Please enter a post title.");
      return;
    }

    if (title.length > TITLE_MAX_LENGTH) {
      setError(`Title must be ${TITLE_MAX_LENGTH} characters or less.`);
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await addPost(title.trim());
      navigation.goBack();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create post. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Pressable
              style={({ pressed }) => [
                styles.backButton,
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>←</Text>
            </Pressable>
            <View style={styles.headerText}>
              <Text style={styles.title}>Create Post</Text>
              <Text style={styles.subtitle}>Add a title for your post</Text>
            </View>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <View style={styles.fieldHeader}>
                <Text style={styles.label}>Title</Text>
                <Text
                  style={[
                    styles.charCount,
                    title.length >= TITLE_MAX_LENGTH && styles.charCountLimit,
                  ]}
                >
                  {title.length}/{TITLE_MAX_LENGTH}
                </Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter post title"
                placeholderTextColor={colors.placeholder}
                value={title}
                onChangeText={(value) => {
                  setTitle(value);
                  if (error) {
                    setError("");
                  }
                }}
                maxLength={TITLE_MAX_LENGTH}
                editable={!isLoading}
                autoFocus
              />
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.actions}>
              <Pressable
                style={({ pressed }) => [
                  styles.createButton,
                  pressed && styles.createButtonPressed,
                  isLoading && styles.createButtonDisabled,
                ]}
                onPress={handleCreate}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.createButtonText}>Create Post</Text>
                )}
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.cancelButton,
                  pressed && styles.cancelButtonPressed,
                ]}
                onPress={() => navigation.goBack()}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
