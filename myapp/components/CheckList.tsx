import React, { useRef, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Animated } from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";

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
    <GestureHandlerRootView style={{ flex: 1, padding: 20 }}>
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
  );
}

const CheckListItem = ({
  item,
  toggleCheck,
  updateAmount,
}: {
  item: Item;
  toggleCheck: (id: string) => void;
  updateAmount: (id: string, change: number) => void;
}) => {
  const translateX = useRef(new Animated.Value(0)).current; // ✅ useRef() をここで使用

  const handleGesture = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    {
      useNativeDriver: false,
    }
  );

  const handleGestureEnd = ({ nativeEvent }: any) => {
    if (nativeEvent.state === State.END) {
      if (nativeEvent.translationX > 50) {
        updateAmount(item.id, 1); // 右スワイプで+1
      } else if (nativeEvent.translationX < -50) {
        updateAmount(item.id, -1); // 左スワイプで-1
      }

      // スワイプ後に中央へ戻る
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: false,
        speed: 15,
        bounciness: 0, // バウンドなし
      }).start();
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={handleGesture}
      onHandlerStateChange={handleGestureEnd}
    >
      <Animated.View
        style={{
          flexDirection: "row-reverse",
          alignItems: "center",
          padding: 10,
          marginVertical: 5,
          backgroundColor: item.checked ? "#f0f0f0" : "#fff",
          borderRadius: 5,
          borderWidth: 1,
          borderColor: "#ccc",
          transform: [{ translateX }],
        }}
      >
        {/* 丸いチェックボックス（右端） */}
        <TouchableOpacity onPress={() => toggleCheck(item.id)}>
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: item.checked ? "#4CAF50" : "#aaa",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 10,
              backgroundColor: item.checked ? "#4CAF50" : "transparent",
            }}
          >
            {item.checked && (
              <Text style={{ color: "#fff", fontSize: 16 }}>✓</Text>
            )}
          </View>
        </TouchableOpacity>

        {/* 個数を表示 */}
        <Text
          style={{
            fontSize: 16,
            minWidth: 30,
            textAlign: "center",
            color: "#555",
            marginRight: 10,
          }}
        >
          {item.amount}
        </Text>

        {/* 名前を強調 */}
        <Text style={{ fontSize: 22, fontWeight: "bold", flex: 1 }}>
          {item.name}
        </Text>
      </Animated.View>
    </PanGestureHandler>
  );
};
