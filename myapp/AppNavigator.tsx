import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";
import { useSession } from "./contexts/SessionContext";
import { useInviteNotification } from "./hooks/useInviteNotification";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SettingsStack from "./screens/SettingsStack";
import ShoppingListScreen from "./screens/ShoppingListScreen";
import SignUpScreen from "./screens/SignUpScreen";
import { BottomNavigator } from "./components/BottomNavigator";

const Stack = createNativeStackNavigator();

// ルートスタックの型を定義
export type RootStackParamList = {
  Home: undefined;
  User: undefined;
  Settings: undefined;
};

export function AppNavigator() {
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
        <BottomNavigator />
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
