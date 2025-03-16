import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  PanResponder,
} from "react-native";
import { useNav } from "../hooks/useNav";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "../contexts/SessionContext";
import { useGetProfile } from "../hooks/useGetProfile";
import Cards from "../components/Cards";
import AddStockModal from "../components/AddStockModal";
import { fridgeTestData } from "../TestData";
import { stocks } from "../types";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = () => {
  const { session, loading } = useSession();
  const [modalVisible, setModalVisible] = useState(false);
  const [stocks, setStocks] = useState<stocks[]>([]);
  const userId = session?.user?.id;

  // プロフィール取得
  const { data: profile, isLoading, error } = useGetProfile(userId);
  const [username, setUsername] = useState(profile?.username || "");

  useEffect(() => {
    setStocks(fridgeTestData);
  }, []);

  // useEffect(() => {
  //   if (session) getProfile();
  // }, [session]);
  const nav = useNav();
  return (
    <View>
      {/* {isLoading && <ActivityIndicator />}
      <Text>ホーム画面{username}</Text>
      <Button title="ユーザ" onPress={() => nav.navigate("User")} />
      <Button title="設定" onPress={() => nav.navigate("Settings")} />
      <View style={styles.verticallySpaced}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View> */}
      <Cards />

      {/* 在庫追加ボタン（右下の少し上） */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          position: "absolute",
          right: 20,
          bottom: 80, // 右下の少し上
          backgroundColor: "#4CAF50",
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
          elevation: 5, // 影をつける
        }}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* モーダル表示 */}
      <AddStockModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        //onStockAdded={fetchStocks}
      />
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
