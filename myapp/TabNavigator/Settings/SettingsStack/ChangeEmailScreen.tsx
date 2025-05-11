import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { CommonStyles } from "../../../styles/CommonStyles";

const ChangeEmailScreen = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = () => {
    if (!email) {
      setEmailError("メールアドレスを入力してください");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("正しいメールアドレスを入力してください");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleChangeEmail = async () => {
    if (!validateEmail()) return;

    try {
      await updateUserEmail(email);
      Alert.alert("成功", "メールアドレスが更新されました");
    } catch (error) {
      if (error instanceof Error) Alert.alert("エラー", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.label}>新しいメールアドレスを入力してください</Text>
        <TextInput
          style={[styles.input, emailError ? styles.inputError : null]}
          placeholder="example@example.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={CommonStyles.completeButton}
          onPress={handleChangeEmail}
        >
          <Text style={CommonStyles.completeButtonText}>変更する</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    marginTop: 40,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 8,
  },
  footer: {
    paddingBottom: 20,
  },
  completeButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  completeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ChangeEmailScreen;

function updateUserEmail(email: string) {
  throw new Error("Function not implemented.");
}
