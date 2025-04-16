import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase/supabase";
import { View, ActivityIndicator, AppState } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeScreen from "./screens/HomeScreen";
import UserScreen from "./screens/UserScreen";
import { SessionProvider, useSession } from "./contexts/SessionContext";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SettingsScreen from "./TabNavigator/Settings/SettingsStack/SettingsMain";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ShoppingListScreen from "./screens/ShoppingListScreen";
import SettingsStack from "./screens/SettingsStack";
import { UserSettingsProvider } from "./contexts/UserSettingsContext";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

// ルートスタックの型を定義
export type RootStackParamList = {
  Home: undefined;
  User: undefined;
  Settings: undefined;
};

function AppNavigator() {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      {session ? (
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "在庫リスト" }}
          />
          <Tab.Screen
            name="ShoppingList"
            component={ShoppingListScreen}
            options={{ title: "買い物リスト" }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsStack}
            options={{ headerShown: false, title: "設定" }}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* <Stack.Screen name="Auth" component={Auth} /> */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
      )}
    </>
  );
}

export default function App() {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    return () => {
      subscription.remove(); // クリーンアップ（リスナーの解除）
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <SessionProvider>
          <UserSettingsProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </UserSettingsProvider>
        </SessionProvider>
      </SafeAreaView>
    </QueryClientProvider>
  );
}
