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
  ScrollView,
} from "react-native";
import { CommonStyles } from "../../../styles/CommonStyles";

const ChangePasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const validate = () => {
    let valid = true;

    if (!password) {
      setPasswordError("パスワードを入力してください");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("6文字以上のパスワードを入力してください");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (password !== confirm) {
      setConfirmError("パスワードが一致しません");
      valid = false;
    } else {
      setConfirmError("");
    }

    return valid;
  };

  const handleChangePassword = () => {
    if (!validate()) return;

    try {
      updateUserPassword(password);
      Alert.alert("成功", "パスワードが更新されました");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("エラー", error.message);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>新しいパスワードを入力してください</Text>
        <TextInput
          style={[styles.input, passwordError ? styles.inputError : null]}
          placeholder="新しいパスワード"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}

        <TextInput
          style={[styles.input, confirmError ? styles.inputError : null]}
          placeholder="確認用パスワード"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />
        {confirmError ? (
          <Text style={styles.errorText}>{confirmError}</Text>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={CommonStyles.completeButton}
          onPress={handleChangePassword}
        >
          <Text style={CommonStyles.completeButtonText}>変更する</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

function updateUserPassword(password: string) {
  throw new Error("Function not implemented.");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
  },
  content: {
    flexGrow: 1,
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
    marginBottom: 16,
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

export default ChangePasswordScreen;
