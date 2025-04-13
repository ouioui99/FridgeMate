import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";

const ChangePasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleChangePassword = () => {
    if (password !== confirm) {
      alert("パスワードが一致しません");
      return;
    }
    console.log("パスワード変更:", password);
    updateUserPassword(password);
    Alert.alert("成功", "パスワードが更新されました");
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>新しいパスワードを入力してください</Text>
      <TextInput
        style={styles.input}
        placeholder="新しいパスワード"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="確認用パスワード"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
      />
      <Button title="変更する" onPress={handleChangePassword} />
    </View>
  );
};

const styles = {
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
};

export default ChangePasswordScreen;
function updateUserPassword(password: string) {
  throw new Error("Function not implemented.");
}
