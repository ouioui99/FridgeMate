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
import { Stock, StockInput, stocks } from "../types/daoTypes";
import { Ionicons } from "@expo/vector-icons";
import { addStock, fetchStocks, updateStock } from "../lib/supabase/stocks";
import { useNavigation } from "@react-navigation/native";
import FormModal from "../components/FormModal";
import { stockFields } from "../inputFields/modalFields";
import { getGroupInvite } from "../lib/supabase/groupInvites";
import { supabase } from "../lib/supabase/supabase";

const HomeScreen = () => {
  const { session, loading } = useSession();
  const [stockModalVisible, setStockModalVisible] = useState(false);
  const [stocks, setStocks] = useState<stocks>([]);
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
    const groupInvite = async () => {
      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        const data = await getGroupInvite(userData.user.email);

        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadStocks();
    groupInvite();
  }, []);

  // ヘッダー右側の「在庫追加ボタン」をナビゲーションにセット
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setStockModalVisible(true)}
          style={styles.addButton}
        >
          <Ionicons name="add-outline" size={28} color="blue" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const onClose = async () => {
    const data = await fetchStocks();
    setStocks(data);
    setStockModalVisible(false);
  };

  const handleUpdateAmount = async (targetId: string, newAmount: number) => {
    // UI を即時更新
    setStocks((prevStocks) =>
      prevStocks.map((stock) =>
        stock.id === targetId ? { ...stock, amount: newAmount } : stock
      )
    );

    try {
      // Supabase のデータを更新（非同期で実行）
      await updateStock(targetId, { amount: newAmount });
    } catch (error) {
      console.error("Error updating stock amount:", error);
      // エラー時に元の値に戻す
      setStocks((prevStocks) =>
        prevStocks.map((stock) =>
          stock.id === targetId ? { ...stock, amount: stock.amount } : stock
        )
      );
    }
  };

  return (
    <View style={styles.container}>
      <Cards stocks={stocks} handleUpdateAmount={handleUpdateAmount} />

      {/* モーダル表示 */}
      <FormModal<StockInput>
        visible={stockModalVisible}
        onClose={() => onClose()}
        fields={stockFields}
        onSubmit={async (data) => {
          await addStock(data);
        }}
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
