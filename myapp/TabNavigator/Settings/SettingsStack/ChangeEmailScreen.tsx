import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";

const ChangeEmailScreen = () => {
  const [email, setEmail] = useState("");

  const handleChangeEmail = async () => {
    try {
      await updateUserEmail(email);
      Alert.alert("成功", "メールアドレスが更新されました");
    } catch (error) {
      if (error instanceof Error) Alert.alert("エラー", error.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>新しいメールアドレスを入力してください</Text>
      <TextInput
        style={styles.input}
        placeholder="example@example.com"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="変更する" onPress={handleChangeEmail} />
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

export default ChangeEmailScreen;
function updateUserEmail(email: string) {
  throw new Error("Function not implemented.");
}
