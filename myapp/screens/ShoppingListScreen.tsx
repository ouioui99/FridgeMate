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
import { shoppingListFields, stockFields } from "../inputFields/modalFields";
import { StockInput, addStock, fetchStocks } from "../lib/supabase/stocks";
import { useGetProfile } from "../hooks/useGetProfile";
import { useSession } from "../contexts/SessionContext";
import {
  addShoppingList,
  getShoppingLists,
} from "../lib/supabase/shoppingLists";
import { ShoppingList, ShoppingListInput } from "../types/daoTypes";

export default function ShoppingListScreen() {
  const navigation = useNavigation();
  const { session, loading } = useSession();
  const userId = session?.user?.id;
  const { data: profile, isLoading, error } = useGetProfile(userId);
  const [shoppingItemFormModalVisible, setShoppingItemFormModalVisibleVisible] =
    useState(false);
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);

  const onClose = async () => {
    const data = await getShoppingLists(profile.current_group_id);
    setShoppingLists(data);
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

  // ヘッダー右側の「在庫追加ボタン」をナビゲーションにセット
  useEffect(() => {
    const loadShoppingLists = async () => {
      try {
        const data = await getShoppingLists(profile.current_group_id);

        setShoppingLists(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (!isLoading) {
      loadShoppingLists();
    }
  }, [isLoading]);

  return (
    <View style={styles.container}>
      <CheckList shoppingLists={shoppingLists} />

      {/* モーダル表示 */}
      <FormModal<ShoppingListInput>
        visible={shoppingItemFormModalVisible}
        onClose={() => onClose()}
        fields={shoppingListFields}
        onSubmit={async (data) => {
          await addShoppingList(data);
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
