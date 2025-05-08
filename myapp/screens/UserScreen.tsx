import { useState } from "react";
import { View, Text, Alert, Button, TextInput } from "react-native";
import { signOut } from "../lib/supabase/users";
import { getProfile } from "../lib/supabase/profiles";
import * as Linking from "expo-linking";

const UserScreen = () => {
  const [inviteeEmail, setInviteeEmail] = useState("");
  const testDeepLink = () => {
    //Linking.openSettings();
    Linking.openURL("myapp://ShoppingList").catch((err) =>
      console.error("URLを開けませんでした。", err)
    );
  };

  const handleSendInvite = async () => {
    const profileData = await getProfile();

    // プロフィール取得
    //const { data: profile, isLoading, error } = useGetProfile(userId);
    // if (!inviteeEmail) {
    //   Alert.alert("Error", "Please fill in all fields");
    //   return;
    // }
    //console.log(profile.currentGroupId);

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
      <Button title="Deep Link テスト" onPress={testDeepLink} />
    </View>
  );
};

export default UserScreen;
