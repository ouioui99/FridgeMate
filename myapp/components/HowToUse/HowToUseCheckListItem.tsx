import React, { useImperativeHandle, forwardRef, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  useDerivedValue,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { ShoppingList } from "../../types/daoTypes";
import { CopilotStep, walkthroughable } from "react-native-copilot";

type Props = {
  item: ShoppingList;
  toggleCheck: (id: string) => void;
  updateAmount: (id: string, change: number) => void;
};

export type HowToUseCheckListItemRef = {
  pseudoSwipe: (direction: "left" | "right") => void;
};

const WalkthroughableText = walkthroughable(Text);
const WalkthroughableView = walkthroughable(View);

const HowToUseCheckListItem = forwardRef<HowToUseCheckListItemRef, Props>(
  ({ item, toggleCheck, updateAmount }, ref) => {
    const translateX = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
    }));

    const backgroundColor = useDerivedValue(() => {
      if (translateX.value > 10) return "rgba(0, 200, 100, 0.2)";
      if (translateX.value < -10) return "rgba(255, 80, 80, 0.2)";
      return "#f0f0f0";
    });

    const pseudoSwipe = (direction: "left" | "right") => {
      const offset = direction === "left" ? -60 : 60;
      direction === "left"
        ? updateAmount(item.id, -1)
        : updateAmount(item.id, 1);

      translateX.value = withSequence(
        withTiming(offset, { duration: 150 }),
        withTiming(0, { duration: 200 })
      );
    };

    // 親コンポーネントから関数を呼べるように公開
    useImperativeHandle(ref, () => ({
      pseudoSwipe,
    }));

    const backgroundStyle = useAnimatedStyle(() => ({
      backgroundColor: backgroundColor.value,
    }));

    const panGesture = Gesture.Pan()
      .onUpdate((e) => {
        translateX.value = e.translationX;
      })
      .onEnd((e) => {
        const THRESHOLD = 50;
        if (e.translationX > THRESHOLD) {
          runOnJS(updateAmount)(item.id, 1);
        } else if (e.translationX < -THRESHOLD) {
          runOnJS(updateAmount)(item.id, -1);
        }
        translateX.value = withTiming(0, { duration: 200 });
      });

    return (
      <CopilotStep
        text="アイテムを左右にスワイプすることでロット数の編集ができます"
        order={12}
        name="editShoppingListItemLot"
      >
        <WalkthroughableView
          style={{ marginVertical: 5, position: "relative" }}
        >
          <GestureDetector gesture={panGesture}>
            <View style={{ position: "relative" }}>
              {/* 背景ビュー */}
              <Animated.View
                style={[
                  {
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    borderRadius: 5,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 20,
                    zIndex: 0,
                  },
                  backgroundStyle,
                ]}
              >
                <Animated.Text
                  style={{
                    fontSize: 20,
                    color: "#aaa",
                    fontWeight: "bold",
                  }}
                >
                  +
                </Animated.Text>
                <Animated.Text
                  style={{
                    fontSize: 20,
                    color: "#aaa",
                    fontWeight: "bold",
                  }}
                >
                  -
                </Animated.Text>
              </Animated.View>

              {/* スワイプ可能な前景ビュー */}
              <Animated.View style={[animatedStyle, { zIndex: 1 }]}>
                <View
                  style={{
                    flexDirection: "row-reverse",
                    alignItems: "center",
                    padding: 10,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: "#ccc",
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
                        backgroundColor: item.checked
                          ? "#4CAF50"
                          : "transparent",
                      }}
                    >
                      {item.checked && (
                        <Text style={{ color: "#fff", fontSize: 16 }}>✓</Text>
                      )}
                    </View>
                  </TouchableOpacity>

                  <CopilotStep
                    text="この数字は在庫リストに追加する際のロット数です。1ロットあたりの個数は設定で変更できます。"
                    order={11}
                    name="shoppingListItemLot"
                  >
                    <WalkthroughableText
                      style={{
                        fontSize: 16,
                        minWidth: 30,
                        textAlign: "center",
                        color: "#555",
                        marginRight: 10,
                      }}
                    >
                      {item.amount}
                    </WalkthroughableText>
                  </CopilotStep>

                  <Text style={{ fontSize: 22, fontWeight: "bold", flex: 1 }}>
                    {item.name}
                  </Text>
                </View>
              </Animated.View>
            </View>
          </GestureDetector>
        </WalkthroughableView>
      </CopilotStep>
    );
  }
);

export default HowToUseCheckListItem;
