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
import CheckList from "../components/CheckList";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import FormModal from "../components/FormModal";
import { stockFields } from "../inputFields/modalFields";
import { StockInput, addStock, fetchStocks } from "../lib/supabase/stocks";

export default function ShoppingListScreen() {
  const navigation = useNavigation();
  const [shoppingItemFormModalVisible, setShoppingItemFormModalVisibleVisible] =
    useState(false);

  const onClose = async () => {
    const data = await fetchStocks();
    // setStocks(data);
    setShoppingItemFormModalVisibleVisible(false);
  };

  // ヘッダー右側の「在庫追加ボタン」をナビゲーションにセット
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setShoppingItemFormModalVisibleVisible(true)}
          style={styles.addButton}
        >
          <Ionicons name="add-outline" size={28} color="blue" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <CheckList />

      {/* モーダル表示 */}
      <FormModal<StockInput>
        visible={shoppingItemFormModalVisible}
        onClose={() => onClose()}
        fields={stockFields}
        onSubmit={async (data) => {
          await addStock(data);
        }}
      />
    </View>
  );
}

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
