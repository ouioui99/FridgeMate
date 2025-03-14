import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
//import { updateUserEmail, updateUserPassword } from "@/lib/auth"; // 仮の関数。実装が必要

const SettingsScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleUpdateEmail = async () => {
    try {
      //await updateUserEmail(email);
      Alert.alert("成功", "メールアドレスが更新されました");
    } catch (error) {
      Alert.alert("エラー", error.message);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      //await updateUserPassword(password);
      Alert.alert("成功", "パスワードが更新されました");
    } catch (error) {
      Alert.alert("エラー", error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        ユーザー情報変更
      </Text>

      <Text>メールアドレス</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        value={email}
        onChangeText={setEmail}
        placeholder="新しいメールアドレス"
        keyboardType="email-address"
      />
      <Button title="メールアドレスを変更" onPress={handleUpdateEmail} />

      <Text style={{ marginTop: 20 }}>パスワード</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        value={password}
        onChangeText={setPassword}
        placeholder="新しいパスワード"
        secureTextEntry
      />
      <Button title="パスワードを変更" onPress={handleUpdatePassword} />
    </View>
  );
};

export default SettingsScreen;
