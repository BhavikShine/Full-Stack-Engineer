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
import { RootStackParamList } from "../../navigation/types";
import { useAuth } from "../../context/AuthContext";
import {
  hasFieldErrors,
  validateRegisterForm,
  type FieldErrors,
} from "../../utils/validation";
import styles from "./styles";
import { colors } from "src/utils/colors";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleRegister = async () => {
    const errors = validateRegisterForm(name, email, password, confirmPassword);
    setFieldErrors(errors);

    if (hasFieldErrors(errors)) {
      return;
    }

    setIsLoading(true);

    try {
      await register(name.trim(), email.trim(), password, confirmPassword);
      navigation.replace("Login", {
        email: email.trim(),
        successMessage: "Account created successfully. Please sign in.",
      });
    } catch (err) {
      setFieldErrors({
        general:
          err instanceof Error
            ? err.message
            : "Registration failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>
              Sign up to get started with Demo
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Full name</Text>
              <TextInput
                style={[styles.input, fieldErrors.name && styles.inputError]}
                placeholder="Enter your full name"
                placeholderTextColor={colors.placeholder}
                value={name}
                onChangeText={(value) => {
                  setName(value);
                  clearFieldError("name");
                  clearFieldError("general");
                }}
                autoCapitalize="words"
                autoCorrect={false}
                editable={!isLoading}
              />
              {fieldErrors.name ? (
                <Text style={styles.fieldError}>{fieldErrors.name}</Text>
              ) : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, fieldErrors.email && styles.inputError]}
                placeholder="you@example.com"
                placeholderTextColor={colors.placeholder}
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  clearFieldError("email");
                  clearFieldError("general");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              {fieldErrors.email ? (
                <Text style={styles.fieldError}>{fieldErrors.email}</Text>
              ) : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[
                  styles.input,
                  fieldErrors.password && styles.inputError,
                ]}
                placeholder="Create a password"
                placeholderTextColor={colors.placeholder}
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  clearFieldError("password");
                  clearFieldError("confirmPassword");
                  clearFieldError("general");
                }}
                secureTextEntry
                editable={!isLoading}
              />
              {fieldErrors.password ? (
                <Text style={styles.fieldError}>{fieldErrors.password}</Text>
              ) : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Confirm password</Text>
              <TextInput
                style={[
                  styles.input,
                  fieldErrors.confirmPassword && styles.inputError,
                ]}
                placeholder="Confirm your password"
                placeholderTextColor={colors.placeholder}
                value={confirmPassword}
                onChangeText={(value) => {
                  setConfirmPassword(value);
                  clearFieldError("confirmPassword");
                  clearFieldError("general");
                }}
                secureTextEntry
                editable={!isLoading}
              />
              {fieldErrors.confirmPassword ? (
                <Text style={styles.fieldError}>
                  {fieldErrors.confirmPassword}
                </Text>
              ) : null}
            </View>

            {fieldErrors.general ? (
              <Text style={styles.error}>{fieldErrors.general}</Text>
            ) : null}

            <Pressable
              style={({ pressed }) => [
                styles.registerButton,
                pressed && styles.registerButtonPressed,
                isLoading && styles.registerButtonDisabled,
              ]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.registerButtonText}>Create Account</Text>
              )}
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => navigation.navigate("Login")}>
              <Text style={styles.signInText}>Sign in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
