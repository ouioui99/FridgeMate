import React, { useRef, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Animated } from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
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

export default function CheckList() {
  const [items, setItems] = useState<Item[]>(initialItems);

  const toggleCheck = (id: string) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      );

      return [
        ...updatedItems.filter((item) => !item.checked),
        ...updatedItems.filter((item) => item.checked),
      ];
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
