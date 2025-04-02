import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  UIManager,
  LayoutAnimation,
  Platform,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CheckListItem from "./CheckListItem";
import { ShoppingList } from "../types/daoTypes";
import { updateShoppingList } from "../lib/supabase/shoppingLists";

type CheckListProps = {
  shoppingLists: ShoppingList[];
  setShoppingLists: React.Dispatch<React.SetStateAction<ShoppingList[]>>;
};

// Androidでレイアウトアニメーションを有効化
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function CheckList({
  shoppingLists,
  setShoppingLists,
}: CheckListProps) {
  const toggleCheck = async (id: string) => {
    // アニメーションを適用
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        240, // アニメーション時間
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity
      )
    );
    setShoppingLists((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      );
      return updatedItems.sort((a, b) => Number(a.checked) - Number(b.checked));
    });

    try {
      // データベースを更新
      const targetItem = shoppingLists.find((item) => item.id === id);
      if (!targetItem) return;

      await updateShoppingList(id, {
        checked: !targetItem.checked,
      });
    } catch (error) {
      // エラー発生時は元の状態に戻す（アニメーションなし）
      setShoppingLists(shoppingLists);
      console.error("チェック状態の更新に失敗しました:", error);
      alert("チェック状態の更新に失敗しました");
    }
  };

  const updateAmount = async (id: string, change: number) => {
    setShoppingLists((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, amount: Math.max(0, item.amount + change) }
          : item
      )
    );

    try {
      // データベースを更新
      const targetItem = shoppingLists.find((item) => item.id === id);
      if (!targetItem) return;

      const newAmount = Math.max(0, targetItem.amount + change);
      await updateShoppingList(id, { amount: newAmount });
    } catch (error) {
      // エラー発生時は元の状態に戻す
      setShoppingLists(shoppingLists);
      console.error("数量の更新に失敗しました:", error);
      alert("数量の更新に失敗しました");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <GestureHandlerRootView>
        <FlatList
          data={shoppingLists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CheckListItem
              item={item}
              toggleCheck={toggleCheck}
              updateAmount={updateAmount}
            />
          )}
        />
      </GestureHandlerRootView>
    </View>
  );
}
