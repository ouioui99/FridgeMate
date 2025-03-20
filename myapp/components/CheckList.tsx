import React, { useState } from "react";
import {
  View,
  FlatList,
  UIManager,
  LayoutAnimation,
  Platform,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CheckListItem from "./CheckListItem";

type Item = {
  id: string;
  name: string;
  amount: number;
  checked: boolean;
};

const initialItems: Item[] = [
  { id: "1", name: "Apple", amount: 1, checked: false },
  { id: "2", name: "Banana", amount: 2, checked: false },
  { id: "3", name: "Orange", amount: 3, checked: false },
];

// Androidでレイアウトアニメーションを有効化
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function CheckList() {
  const [items, setItems] = useState<Item[]>(initialItems);

  const toggleCheck = (id: string) => {
    // アニメーションを適用
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      );

      return updatedItems.sort((a, b) => Number(a.checked) - Number(b.checked));
    });
  };

  const updateAmount = (id: string, change: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, amount: Math.max(0, item.amount + change) }
          : item
      )
    );
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <GestureHandlerRootView>
        <FlatList
          data={items}
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
