import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import SettingsStack from "../screens/SettingsStack";
import ShoppingListScreen from "../screens/ShoppingListScreen";
import { useInviteNotification } from "../hooks/useInviteNotification";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { SettingsIconWithBadge } from "./SettingsIconWithBadge";

const Tab = createBottomTabNavigator();

export function BottomNavigator() {
  const { inviteCodeUses } = useInviteNotification();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#f0edf6"
      inactiveColor="#3e2465"
      barStyle={{ backgroundColor: "#694fad" }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "在庫リスト",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="fridge" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="ShoppingList"
        component={ShoppingListScreen}
        options={{
          title: "買い物リスト",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cart" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          headerShown: false,
          title: "設定",
          tabBarIcon: ({ color }) => (
            <SettingsIconWithBadge
              showBadge={0 < inviteCodeUses.length}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
