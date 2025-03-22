import { useState } from "react";
import { View, Text, Alert, Button, TextInput } from "react-native";
import { sendStockInvite } from "../lib/supabase/stockShares";
import { signOut } from "../lib/supabase/users";

const UserScreen = () => {
  const [inviteeEmail, setInviteeEmail] = useState("");

  const handleSendInvite = async () => {
    if (!inviteeEmail) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    await sendStockInvite(stockId, inviteeEmail);
    Alert.alert("Success", "Invite sent successfully");

    setInviteeEmail("");
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Invitee Email"
        value={inviteeEmail}
        onChangeText={setInviteeEmail}
        style={{ marginBottom: 10, padding: 10, borderWidth: 1 }}
      />
      <Button title="Send Invite" onPress={handleSendInvite} />
      <Button title="サインアウト" onPress={signOut} />
    </View>
  );
};

export default UserScreen;
