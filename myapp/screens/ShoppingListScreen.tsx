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
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import FormModal from "../components/FormModal";
import { shoppingListFields, stockFields } from "../inputFields/modalFields";
import { useGetProfile } from "../hooks/useGetProfile";
import { useSession } from "../contexts/SessionContext";
import {
  addShoppingList,
  deleteShoppingList,
  getShoppingLists,
} from "../lib/supabase/shoppingLists";
import {
  ShoppingList,
  ShoppingListInput,
  Stock,
  StockInput,
  stocks,
} from "../types/daoTypes";
import { getExpirationDateList } from "../lib/google/gemini";
import {
  addStocks,
  fetchSomeStocks,
  updateStock,
} from "../lib/supabase/stocks";
import dayjs from "dayjs";
import { fetchItems } from "../lib/supabase/util";
import { fetchReplenishmentSettingsByStockId } from "../lib/supabase/stockReplenishmentSetting";
import { CommonStyles } from "../styles/CommonStyles";

export default function ShoppingListScreen() {
  const navigation = useNavigation();
  const { session, loading } = useSession();
  const userId = session?.user?.id;
  const { data: profile, isLoading, error } = useGetProfile(userId);
  const [shoppingItemFormModalVisible, setShoppingItemFormModalVisibleVisible] =
    useState(false);
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!isLoading && profile) {
        fetchItems<ShoppingList[]>(
          setShoppingLists,
          profile.current_group_id,
          getShoppingLists
        );
      }
    }, [isLoading, profile])
  );

  const onClose = async () => {
    if (!profile) return;
    const data = await getShoppingLists(profile.current_group_id);
    setShoppingLists(data);
    setShoppingItemFormModalVisibleVisible(false);
  };

  //賞味期限追加Ver
  // const handleShoppingComplete = async () => {
  //   const checkedNameList = shoppingLists
  //     .filter((item) => item.checked)
  //     .map((item) => item.name);

  //   //すでにDBに登録済みのstocksをDBから取得
  //   const toUpdateStocks: Stock[] = await fetchSomeStocks(
  //     profile.current_group_id,
  //     checkedNameList
  //   );
  //   const toUpdateStocksName = new Set(toUpdateStocks.map((obj) => obj.name));

  //   const toInsertShoppingListName: string[] = checkedNameList.filter(
  //     (name) => !toUpdateStocksName.has(name)
  //   );

  //   if (0 < toInsertShoppingListName.length) {
  //     const insertDataExpirationDateList: string[] =
  //       await getExpirationDateList(toInsertShoppingListName);

  //     const insertShoppingList: ShoppingList[] = shoppingLists.filter((item) =>
  //       toInsertShoppingListName.includes(item.name)
  //     );
  //     const insertShoppingListId: string[] = insertShoppingList.map(
  //       (item) => item.id
  //     );

  //     const nameAmountAndExpirationList = insertShoppingList.map(
  //       (item, index) => {
  //         const daysToAdd = insertDataExpirationDateList[index];
  //         const expirationDate =
  //           daysToAdd != null
  //             ? dayjs().add(daysToAdd, "day").format("YYYY-MM-DD")
  //             : null;

  //         return {
  //           name: item.name,
  //           amount: item.amount,
  //           expiration_date: expirationDate,
  //         };
  //       }
  //     );

  //     addStocks(nameAmountAndExpirationList as StockInput[]);
  //     deleteShoppingList(insertShoppingListId);
  //   }

  //   if (0 < toUpdateStocksName.size) {
  //     const updateDataExpirationDateList: string[] =
  //       await getExpirationDateList([...toUpdateStocksName]);

  //     const updateShoppingList: ShoppingList[] = shoppingLists.filter((item) =>
  //       toUpdateStocksName.has(item.name)
  //     );
  //     const updatedToUpdateStocks = toUpdateStocks.map((stock, index) => {
  //       const matchingItem = updateShoppingList.find(
  //         (item) => item.name === stock.name
  //       );

  //       const daysToAddStr = updateDataExpirationDateList[index];
  //       const daysToAdd =
  //         daysToAddStr !== null && daysToAddStr !== undefined
  //           ? Number(daysToAddStr)
  //           : null;

  //       const expiration_date =
  //         daysToAdd != null
  //           ? dayjs().add(daysToAdd, "day").format("YYYY-MM-DD")
  //           : null;

  //       return {
  //         ...stock,
  //         ...(matchingItem ?? {}),
  //         expiration_date,
  //       };
  //     });
  //   }

  //   const data = await getShoppingLists(profile.current_group_id);
  //   setShoppingLists(data);
  // };
  const handleShoppingComplete = async () => {
    if (!profile) return;
    const checkedNameList = shoppingLists
      .filter((item) => item.checked)
      .map((item) => item.name);

    //すでにDBに登録済みのstocksをDBから取得
    const toUpdateStocks: Stock[] = await fetchSomeStocks(
      profile.current_group_id,
      checkedNameList
    );
    const toUpdateStocksName = new Set(toUpdateStocks.map((obj) => obj.name));

    const toInsertShoppingListName: string[] = checkedNameList.filter(
      (name) => !toUpdateStocksName.has(name)
    );

    if (0 < toInsertShoppingListName.length) {
      const insertShoppingList: ShoppingList[] = shoppingLists.filter((item) =>
        toInsertShoppingListName.includes(item.name)
      );
      const insertShoppingListId: string[] = insertShoppingList.map(
        (item) => item.id
      );

      const insertStocks = insertShoppingList.map((item) => {
        return {
          name: item.name,
          amount: item.amount,
        };
      });

      await addStocks(insertStocks as StockInput[], profile.current_group_id);
      await deleteShoppingList(insertShoppingListId);
    }

    if (0 < toUpdateStocksName.size) {
      const updateShoppingList: ShoppingList[] = shoppingLists.filter((item) =>
        toUpdateStocksName.has(item.name)
      );
      const updateShoppingListId = updateShoppingList.map((item) => item.id);

      const updatedStocks = await Promise.all(
        toUpdateStocks.map(async (stock) => {
          const matchedItem = updateShoppingList.find(
            (item) => item.name === stock.name
          )!;
          const setting = await fetchReplenishmentSettingsByStockId(stock.id);

          const minimumNumber = setting?.replenishment_amount ?? 1;

          return {
            ...stock,
            amount: stock.amount + matchedItem.amount * minimumNumber,
          };
        })
      );

      for (const stock of updatedStocks) {
        await updateStock(stock.id, stock as StockInput);
      }

      await deleteShoppingList(updateShoppingListId);
    }

    const data = await getShoppingLists(profile.current_group_id);

    setShoppingLists([...data]);
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
      if (!profile) return;
      try {
        const data = await getShoppingLists(profile.current_group_id);
        setShoppingLists(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (!isLoading && profile) {
      loadShoppingLists();
    }
  }, [isLoading, profile]);

  return (
    <View style={styles.container}>
      <CheckList
        shoppingLists={shoppingLists}
        setShoppingLists={setShoppingLists}
      />

      <View style={{ paddingHorizontal: 20, marginTop: 16, marginBottom: 18 }}>
        <TouchableOpacity
          style={CommonStyles.completeButton}
          onPress={handleShoppingComplete}
        >
          <Text style={CommonStyles.completeButtonText}>買い物完了</Text>
        </TouchableOpacity>
      </View>

      {/* モーダル */}
      <FormModal<ShoppingListInput>
        visible={shoppingItemFormModalVisible}
        onClose={() => onClose()}
        fields={shoppingListFields}
        handleDelete={async () => {}}
        onSubmit={async (data) => {
          if (!profile) return;
          await addShoppingList(data, profile.current_group_id);
        }}
        initialData={{}}
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
  completeButton: {
    backgroundColor: "#4CAF50", // 緑色
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    marginBottom: 20,
  },
  completeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
