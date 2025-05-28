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
import HowToUseShoppingList from "../components/HowToUse/HowToUseShoppingList";

const { width } = Dimensions.get("window");

const WalkthroughableText = walkthroughable(Text);
const WalkthroughableView = walkthroughable(View);
const WalkthroughableTouchableOpacity = walkthroughable(TouchableOpacity);

export default function HowToUseScreen() {
  const { start, copilotEvents } = useCopilot();
  const [showShoppingList, setShowShoppingList] = useState(false);
  const lastStepNameRef = useRef("");

  const homeOpacity = useRef(new Animated.Value(1)).current;
  const shoppingListOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    copilotEvents.on("stepChange", handleStepChange);
    return () => {
      copilotEvents.off("stepChange", handleStepChange);
    };
  }, [copilotEvents]);

  const handleStepChange = (step: any) => {
    if (
      lastStepNameRef.current === "shoppingListBtn" &&
      step.name === "MinusButton"
    ) {
      toggleToHome();
    }

    if (step.name === "shoppingListBtn") {
      setTimeout(() => {
        toggleToShoppingList();
        lastStepNameRef.current = step.name;
      }, 700);
      return;
    }

    lastStepNameRef.current = step.name;
  };

  const toggleToHome = () => {
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
  };

  const toggleToShoppingList = () => {
    setShowShoppingList(true);
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
        <HowToUseShoppingList
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
