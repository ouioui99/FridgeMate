import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase/supabase";
import { Snackbar } from "react-native-paper";
import { useSnackbar } from "../hooks/useSnackbar";
import { MESSAGES } from "../constants/messages";

export default function SignUpScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigation = useNavigation();
  const { visible, message, showMessage, hideSnackbar } = useSnackbar();

  async function signUpWithEmail() {
    let newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    let hasError = false;

    if (!username) {
      newErrors.username = "ユーザー名を入力してください。";
      hasError = true;
    } else if (username.length < 3) {
      newErrors.username = "ユーザ名は3文字以上で入力してください";
      hasError = true;
    }

    if (!email) {
      newErrors.email = "メールアドレスを入力してください。";
      hasError = true;
    }
    if (!password) {
      newErrors.password = "パスワードを入力してください。";
      hasError = true;
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "確認用パスワードを入力してください。";
      hasError = true;
    }
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "パスワードが一致しません。";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username,
        },
      },
    });

    if (error) {
      console.log(error);

      setErrors((prev) => ({ ...prev, email: error.message }));
    } else if (!session) {
      showMessage(MESSAGES.OK.completeSendCertificationMail);
    }

    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.header}>
            <Image
              source={{ uri: "/placeholder.svg?height=100&width=100" }}
              style={styles.logo}
            />
            <Text style={styles.title}>アカウントを作成</Text>
            <Text style={styles.subtitle}>サインアップして始めましょう</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>ユーザ名</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.username ? styles.inputError : null,
                ]}
                placeholder="表示用の名前を入力"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                keyboardType="default"
              />
              {errors.email ? (
                <Text style={styles.errorText}>{errors.username}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>メールアドレス</Text>
              <TextInput
                style={[styles.input, errors.email ? styles.inputError : null]}
                placeholder="email@example.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              {errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>パスワード</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.password ? styles.inputError : null,
                ]}
                placeholder="パスワードを入力"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              {errors.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>パスワード確認</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.confirmPassword ? styles.inputError : null,
                ]}
                placeholder="パスワードを確認"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              {errors.confirmPassword ? (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={signUpWithEmail}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>サインアップ</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              すでにアカウントをお持ちですか？
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login" as never)}
            >
              <Text style={styles.footerLink}>ログイン</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Snackbar
          visible={visible}
          onDismiss={hideSnackbar}
          duration={5000}
          action={{ label: "閉じる", onPress: hideSnackbar }}
        >
          {message}
        </Snackbar>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  form: {
    width: "100%",
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  button: {
    backgroundColor: "#4f46e5",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "#666",
    marginRight: 5,
  },
  footerLink: {
    color: "#4f46e5",
    fontWeight: "600",
  },
});
