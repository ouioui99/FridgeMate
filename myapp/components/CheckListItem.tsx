// components/CheckListItem.tsx
import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { ShoppingList } from "../types/daoTypes";

type Props = {
  item: ShoppingList;
  toggleCheck: (id: string) => void;
  updateAmount: (id: string, change: number) => void;
};

const CheckListItem: React.FC<Props> = ({
  item,
  toggleCheck,
  updateAmount,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [showSymbol, setShowSymbol] = useState<"+" | "-" | null>(null);

  const handleGesture = ({ nativeEvent }: any) => {
    const { translationX } = nativeEvent;
    setShowSymbol(translationX > 10 ? "+" : translationX < -10 ? "-" : null);
    translateX.setValue(translationX);
  };

  const handleGestureEnd = ({ nativeEvent }: any) => {
    if (nativeEvent.state === State.END) {
      let change = 0;
      if (nativeEvent.translationX > 50) change = 1;
      else if (nativeEvent.translationX < -50) change = -1;

      if (change !== 0) {
        updateAmount(item.id, change);
        setTimeout(() => setShowSymbol(null), 500);
      } else {
        setShowSymbol(null);
      }

      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: false,
        speed: 15,
        bounciness: 0,
      }).start();
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={handleGesture}
      onHandlerStateChange={handleGestureEnd}
      activeOffsetX={[-2, 2]}
    >
      <View style={{ position: "relative", marginVertical: 5 }}>
        {/* スワイプ後の「+」「-」表示 */}
        {showSymbol && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: showSymbol === "-" ? "flex-end" : "flex-start",
              justifyContent: "center",
              backgroundColor: showSymbol === "-" ? "#DFFFD6" : "#FFD6D6",
              borderRadius: 5,
              paddingHorizontal: 20,
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "#555" }}>
              {showSymbol}
            </Text>
          </View>
        )}

        {/* スワイプするアイテム本体 */}
        <Animated.View
          style={{
            flexDirection: "row-reverse",
            alignItems: "center",
            padding: 10,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: "#ccc",
            transform: [{ translateX }],
            backgroundColor: "#fff",
          }}
        >
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

          {/* 個数 */}
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

          {/* 名前 */}
          <Text style={{ fontSize: 22, fontWeight: "bold", flex: 1 }}>
            {item.name}
          </Text>
        </Animated.View>
      </View>
    </PanGestureHandler>
  );
};

export default CheckListItem;
