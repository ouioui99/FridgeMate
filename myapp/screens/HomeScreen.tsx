import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNav } from "../hooks/useNav";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useSession } from "../contexts/SessionContext";
import { useGetProfile } from "../hooks/useGetProfile";

const HomeScreen = () => {
  const { session, loading } = useSession();
  const userId = session?.user?.id;

  // プロフィール取得
  const { data: profile, isLoading, error } = useGetProfile(userId);
  const [username, setUsername] = useState(profile?.username || "");
  console.log(username);

  // useEffect(() => {
  //   if (session) getProfile();
  // }, [session]);
  const nav = useNav();
  return (
    <View>
      {isLoading && <ActivityIndicator />}
      <Text>ホーム画面{username}</Text>
      <Button title="ユーザ" onPress={() => nav.navigate("User")} />
      <Button title="設定" onPress={() => nav.navigate("Settings")} />
      <View style={styles.verticallySpaced}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
