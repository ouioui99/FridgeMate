// screens/SettingsStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsScreen from "../TabNavigator/Settings/SettingsStack/SettingsMain";
import ChangeEmailScreen from "../TabNavigator/Settings/SettingsStack/ChangeEmailScreen";
import ChangePasswordScreen from "../TabNavigator/Settings/SettingsStack/ChangePasswordScreen";
import ManageGroupScreen from "../TabNavigator/Settings/SettingsStack/ManageGroupScreen";
import ManageGroupMemberScreen from "../TabNavigator/Settings/SettingsStack/ManageGroupMemberScreen";
import SettingMinimumNumberScreen from "../TabNavigator/Settings/SettingsStack/SettingMinimumNumberScreen";
import HowToUseScreen from "./HowToUseScreen";
import HomeScreen from "./HomeScreen";

export type SettingsStackParamList = {
  Home: undefined;
  ChangeEmail: undefined;
  ChangePassword: undefined;
  ManageGroupMember: undefined;
  ManageGroup: undefined;
  SettingMinimumNumber: undefined;
  HowToUse: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "在庫リスト" }}
      />
      <Stack.Screen
        name="HowToUse"
        component={HowToUseScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
