import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";
import { useSession } from "./contexts/SessionContext";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import { BottomNavigator } from "./components/BottomNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import OnboardingScreen from "./screens/OnboardingScreen";
import { USER_KEY } from "./constants/settings";
import * as SecureStore from "expo-secure-store";
import { supabase } from "./lib/supabase/supabase";
import { initializeUser } from "./lib/supabase/users";

const Stack = createNativeStackNavigator();

// ルートスタックの型を定義
export type RootStackParamList = {
  Home: undefined;
  User: undefined;
  Settings: undefined;
};

export function AppNavigator() {
  const { session, loading } = useSession();
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasLaunched = await AsyncStorage.getItem("hasLaunched");

      if (hasLaunched === null) {
        await SecureStore.deleteItemAsync(USER_KEY);
        await AsyncStorage.setItem("hasLaunched", "true");
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
        if (!session) {
          initializeUser();
        }
      }
    };
    checkFirstLaunch();
  }, []);

  if (loading || isFirstLaunch === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      {session ? (
        <BottomNavigator />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isFirstLaunch && (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          )}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
      )}
    </>
  );
}
