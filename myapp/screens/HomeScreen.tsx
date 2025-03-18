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
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "../contexts/SessionContext";
import { useGetProfile } from "../hooks/useGetProfile";
import Cards from "../components/Cards";
import AddStockModal from "../components/AddStockModal";
import { stocks } from "../types";
import { Ionicons } from "@expo/vector-icons";
import { fetchStocks } from "../lib/supabase/stocks";
import { Header } from "react-native/Libraries/NewAppScreen";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const { session, loading } = useSession();
  const [modalVisible, setModalVisible] = useState(false);
  const [stocks, setStocks] = useState<stocks[]>([]);
  const userId = session?.user?.id;
  const nav = useNav();
  const navigation = useNavigation();

  // プロフィール取得
  const { data: profile, isLoading, error } = useGetProfile(userId);

  useEffect(() => {
    const loadStocks = async () => {
      try {
        const data = await fetchStocks();
        setStocks(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadStocks();
  }, []);

  // ヘッダー右側の「在庫追加ボタン」をナビゲーションにセット
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.addButton}
        >
          <Ionicons name="add-outline" size={28} color="blue" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Cards stocks={stocks} />

      {/* モーダル表示 */}
      <AddStockModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onStockAdded={fetchStocks}
        setStocks={setStocks}
      />

      {/* ロード中のインジケーター */}
      {isLoading && <ActivityIndicator style={styles.loading} />}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#4CAF50",
    paddingTop: 40, // ステータスバーを考慮
    paddingBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  addButton: {
    marginRight: 15,
  },
  loading: {
    marginTop: 20,
  },
});
