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
import { HowToUseCheckListItemRef } from "../components/HowToUse/HowToUseCheckListItem";
import HowToUseSettingsMain from "../components/HowToUse/HowToUseSettingsMain";
import { useNavigation } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "./MainStack";

const { width } = Dimensions.get("window");

const WalkthroughableText = walkthroughable(Text);
const WalkthroughableView = walkthroughable(View);
const WalkthroughableTouchableOpacity = walkthroughable(TouchableOpacity);

type Props = NativeStackScreenProps<RootStackParamList, "HowToUse">;

export default function HowToUseScreen({ route }: Props) {
  const { start, copilotEvents } = useCopilot();
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const lastStepNameRef = useRef("");

  const homeOpacity = useRef(new Animated.Value(1)).current;
  const shoppingListOpacity = useRef(new Animated.Value(0)).current;
  const settingOpacity = useRef(new Animated.Value(0)).current;

  const itemRef = useRef<HowToUseCheckListItemRef>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { previousScreenName } = route.params;

  useEffect(() => {
    copilotEvents.on("stepChange", handleStepChange);
    copilotEvents.on("stop", handleStopCopilot);
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
    } else if (
      lastStepNameRef.current === "settingBtn" &&
      step.name === "editShoppingListItemLot"
    ) {
      toggleToShoppingList();
    }

    switch (step.name) {
      case "shoppingListBtn": {
        setTimeout(() => {
          toggleToShoppingList();
          lastStepNameRef.current = step.name;
        }, 700);

        break;
      }
      case "editShoppingListItemLot": {
        setTimeout(() => {
          itemRef.current?.pseudoSwipe("right");
        }, 500);
        setTimeout(() => {
          itemRef.current?.pseudoSwipe("left");
        }, 1250);
        break;
      }
      case "settingBtn": {
        setTimeout(() => {
          toggleToSetting();
          lastStepNameRef.current = step.name;
        }, 700);
        break;
      }
      case "PlusButton": {
        break;
      }
      default:
        break;
    }

    lastStepNameRef.current = step.name;
  };

  const handleStopCopilot = () => {
    if (previousScreenName === "SettingsMain") {
      navigation.navigate("Home", {
        screen: "Settings",
        params: {
          previousScreenName: "SettingsMain",
        },
      });
    } else {
      navigation.navigate(previousScreenName as never);
    }
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
      Animated.timing(settingOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toggleToSetting = () => {
    setShowSetting(true);
    Animated.parallel([
      Animated.timing(homeOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(shoppingListOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(settingOpacity, {
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
          itemRef={itemRef}
        />
      </Animated.View>

      <Animated.View
        style={[StyleSheet.absoluteFillObject, { opacity: settingOpacity }]}
        pointerEvents={showShoppingList ? "auto" : "none"}
      >
        <HowToUseSettingsMain
        // WalkthroughableView={WalkthroughableView}
        // WalkthroughableTouchableOpacity={WalkthroughableTouchableOpacity}
        // itemRef={itemRef}
        />
      </Animated.View>
    </View>
  );
}
