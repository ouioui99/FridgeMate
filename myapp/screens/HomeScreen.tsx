import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "../contexts/SessionContext";
import { useGetProfile } from "../hooks/useGetProfile";
import Cards from "../components/Cards";
import {
  ShoppingListInput,
  Stock,
  StockInput,
  stocks,
} from "../types/daoTypes";
import { Ionicons } from "@expo/vector-icons";
import {
  addStock,
  deleteStock,
  fetchStocks,
  updateStock,
} from "../lib/supabase/stocks";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import FormModal from "../components/FormModal";
import { stockFields } from "../inputFields/modalFields";
import {
  addShoppingList,
  getShoppingListItem,
} from "../lib/supabase/shoppingLists";
import { fetchItems } from "../lib/supabase/util";
import { useUserSettings } from "../contexts/UserSettingsContext";
import { validateStockInput } from "../utils/validation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WelcomeModal from "../components/WelcomeModal";

const HomeScreen = () => {
  const { session, loading } = useSession();
  const [stockModalVisible, setStockModalVisible] = useState(false);
  const [stocks, setStocks] = useState<stocks>([]);
  const [updateData, setUpdateData] = useState<Stock | {}>({});
  const [firstLaunchModalVisible, setFirstLaunchModalVisible] = useState(false);

  const userId = session?.user?.id;
  const navigation = useNavigation();

  // プロフィール取得
  const { data: profile, isLoading, error } = useGetProfile(userId);

  const { autoAddToShoppingList, isConfirmWhenAutoAddToShoppingList } =
    useUserSettings();

  useFocusEffect(
    useCallback(() => {
      if (!isLoading && profile) {
        fetchItems<stocks>(setStocks, profile.current_group_id, fetchStocks);
      }
    }, [isLoading])
  );

  const autoAddShoppingList = async (targetStock: Stock) => {
    if (!profile) return;
    const shoppingListItem = await getShoppingListItem(
      targetStock.name,
      profile.current_group_id
    );
    if (shoppingListItem.length === 0) {
      const addShoppingListData = {
        name: targetStock.name,
        amount: 1,
        checked: false,
        creater_id: userId,
        group_id: profile.current_group_id,
      } as ShoppingListInput;
      await addShoppingList(addShoppingListData, profile.current_group_id);
      Alert.alert("買い物リストに登録しました");
    } else {
      Alert.alert("すでに登録済みです");
    }
  };

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

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        //const hasLaunched = await AsyncStorage.getItem("hasLaunchedHome");
        if (true) {
          // 初回起動なのでモーダル表示
          setFirstLaunchModalVisible(true);
          //await AsyncStorage.setItem("hasLaunchedHome", "true");
        }
      } catch (error) {
        console.error("Failed to check first launch:", error);
      }
    };

    checkFirstLaunch();
  }, []);

  const onClose = async () => {
    if (!profile) return;
    const data = await fetchStocks(profile.current_group_id);
    setStocks(data);
    setStockModalVisible(false);
    setUpdateData({});
  };

  const handleDelete = async () => {
    if (!profile) return;
    if (updateData && "id" in updateData) {
      await deleteStock(updateData.id);
    }

    const data = await fetchStocks(profile.current_group_id);
    setStocks(data);
    setStockModalVisible(false);
    setUpdateData({});
  };

  const handleUpdateAmount = async (targetId: string, newAmount: number) => {
    const targetStock = stocks.find((stock) => stock.id === targetId);
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

    if (autoAddToShoppingList && targetStock && newAmount === 0) {
      if (targetStock && isConfirmWhenAutoAddToShoppingList) {
        Alert.alert(
          "買い物リストに追加",
          `${targetStock.name} の在庫が0になりました。買い物リストに追加しますか？`,
          [
            {
              text: "キャンセル",
              style: "cancel",
            },
            {
              text: "追加する",
              onPress: () => {
                autoAddShoppingList(targetStock);
              },
            },
          ]
        );
      } else {
        autoAddShoppingList(targetStock);
      }
    }
  };

  const handleClickCard = (item: Stock) => {
    setUpdateData(item);
    setStockModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Cards
        stocks={stocks}
        handleUpdateAmount={handleUpdateAmount}
        handleClickCard={handleClickCard}
      />

      {/* モーダル表示 */}
      <FormModal<StockInput>
        visible={stockModalVisible}
        onClose={() => onClose()}
        fields={stockFields}
        onSubmit={async (data) => {
          if (!profile) return;
          if ("id" in updateData && updateData.id) {
            // idがある＝編集とみなす
            await updateStock(updateData.id, data);
          } else {
            // 新規登録
            await addStock(data, profile.current_group_id);
          }
        }}
        handleDelete={handleDelete}
        validation={validateStockInput}
        initialData={updateData}
      />
      <WelcomeModal
        visible={firstLaunchModalVisible}
        onClose={() => setFirstLaunchModalVisible(false)}
        onPressHowToUse={() => {
          setFirstLaunchModalVisible(false);
          navigation.navigate("HowToUse" as never);
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
