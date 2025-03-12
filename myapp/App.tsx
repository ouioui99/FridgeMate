import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { View, ActivityIndicator, AppState } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeScreen from "./screens/HomeScreen";
import UserScreen from "./screens/UserScreen";
import { SessionProvider, useSession } from "./contexts/SessionContext";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import { useAuth0, Auth0Provider } from "react-native-auth0";
import Test from "./screens/Test";

const Stack = createNativeStackNavigator();

// ルートスタックの型を定義
export type RootStackParamList = {
  Home: undefined;
  User: undefined;
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
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="User" component={UserScreen} />
        </>
      ) : (
        <>
          {/* <Stack.Screen name="Auth" component={Auth} /> */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Test" component={Test} />
        </>
      )}
    </Stack.Navigator>
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
    <Auth0Provider
      domain={"dev-yyrtzodwxsh8oevn.us.auth0.com"}
      clientId={"HuFqKiZd9zpvdiv5IAcSveW0eyjJ5fhS"}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <SessionProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </SessionProvider>
      </SafeAreaView>
    </Auth0Provider>
  );
}
