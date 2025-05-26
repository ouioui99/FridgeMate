import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import {
  CopilotProvider,
  useCopilot,
  walkthroughable,
} from "react-native-copilot";
import Home from "../components/HowToUse/Home";
import ShoppingList from "../components/HowToUse/ShoppingList";

const { width } = Dimensions.get("window");

const WalkthroughableText = walkthroughable(Text);
const WalkthroughableView = walkthroughable(View);
const WalkthroughableTouchableOpacity = walkthroughable(TouchableOpacity);

export default function HowToUseScreen() {
  const { start, copilotEvents } = useCopilot();
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [lastStepName, setLastStepName] = useState("");

  // 2つのコンポーネントのopacityを管理
  const homeOpacity = useRef(new Animated.Value(1)).current;
  const shoppingListOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    copilotEvents.on("stepChange", handleStepChange);

    return () => {
      copilotEvents.off("stepChange", handleStepChange);
    };
  }, [copilotEvents]);
  const handleStepChange = (step: any) => {
    console.log("Prev step:", lastStepName, "Current step:", step.name);
    // 通常のステップ変更処理
    setLastStepName(step.name);
    // 「ShoppingListから来てMinusButtonに行った」場合、Homeに戻す
    if (lastStepName === "shoppingListBtn" && step.name === "MinusButton") {
      toggleScreen();
    }

    // 「ShoppingList」への遷移指示がきたら遅延して切り替え
    if (step.name === "shoppingListBtn") {
      setTimeout(() => {
        toggleScreen();
        setLastStepName("shoppingListBtn"); // 画面が切り替わった後に更新
      }, 700);
      return; // 他の処理をスキップ
    }
  };

  const toggleScreen = () => {
    if (showShoppingList) {
      // ShoppingList → Home に戻す
      Animated.parallel([
        Animated.timing(shoppingListOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(homeOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setShowShoppingList(false));
    } else {
      setShowShoppingList(true); // 表示状態を先にtrueにしてからアニメーション
      Animated.parallel([
        Animated.timing(homeOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(shoppingListOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  return (
    <View style={{ flex: 1 }} onLayout={() => start()}>
      <Animated.View
        style={[StyleSheet.absoluteFillObject, { opacity: homeOpacity }]}
        pointerEvents={showShoppingList ? "none" : "auto"}
      >
        <Home
          WalkthroughableView={WalkthroughableView}
          WalkthroughableTouchableOpacity={WalkthroughableTouchableOpacity}
        />
      </Animated.View>

      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { opacity: shoppingListOpacity },
        ]}
        pointerEvents={showShoppingList ? "auto" : "none"}
      >
        <ShoppingList
          WalkthroughableView={WalkthroughableView}
          WalkthroughableTouchableOpacity={WalkthroughableTouchableOpacity}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  halfContainer: {
    flex: 0.8,
    backgroundColor: "#f2f2f2",
  },
  header: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff",
    position: "relative",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  plusButton: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  plusText: {
    fontSize: 24,
    color: "#007AFF",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
  },
  navItem: {
    alignItems: "center",
  },
  navLabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
});
