import { View, Text, Button, StyleSheet } from "react-native";
import { useNav } from "../hooks/useNav";
import { supabase } from "../lib/supabase";

const HomeScreen = () => {
  const nav = useNav();
  return (
    <View>
      <Text>ホーム画面</Text>
      <Button title="ユーザ" onPress={() => nav.navigate("User")} />
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
