import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  UIManager,
  LayoutAnimation,
  Platform,
  Alert,
} from "react-native";
import { ShoppingList } from "../../types/daoTypes";
import CheckListItem from "../CheckListItem";
import HowToUseCheckListItem, {
  HowToUseCheckListItemRef,
} from "./HowToUseCheckListItem";

type CheckListProps = {
  shoppingLists: ShoppingList[];
  setShoppingLists: React.Dispatch<React.SetStateAction<ShoppingList[]>>;
  itemRef: React.RefObject<HowToUseCheckListItemRef | null>;
};

// Androidでレイアウトアニメーションを有効化
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HowToUseCheckList({
  shoppingLists,
  setShoppingLists,
  itemRef,
}: CheckListProps) {
  const toggleCheck = (id: string) => {
    setShoppingLists((prevItems) => {
      // mapで状態更新した配列を作成
      const updatedItems = prevItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      );

      // 新しい配列をコピーしてからソートをかける
      const sortedItems = [...updatedItems].sort(
        (a, b) => Number(a.checked) - Number(b.checked)
      );

      return sortedItems;
    });
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        300,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity // または scaleXY
      )
    );
  };

  const updateAmount = (id: string, change: number) => {
    setShoppingLists((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newAmount = Math.max(0, item.amount + change);
          return { ...item, amount: newAmount };
        }
        return item;
      })
    );
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={shoppingLists}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <HowToUseCheckListItem
            item={item}
            toggleCheck={toggleCheck}
            updateAmount={updateAmount}
            ref={index === 2 ? itemRef : null}
          />
        )}
      />
    </View>
  );
}
