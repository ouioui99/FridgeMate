// screens/SettingsStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsScreen from "../TabNavigator/Settings/SettingsStack/SettingsMain";
import ChangeEmailScreen from "../TabNavigator/Settings/SettingsStack/ChangeEmailScreen";
import ChangePasswordScreen from "../TabNavigator/Settings/SettingsStack/ChangePasswordScreen";
import { ManageGroupScreen } from "../TabNavigator/Settings/SettingsStack/ManageGroupScreen";

export type SettingsStackParamList = {
  SettingsMain: undefined;
  ChangeEmail: undefined;
  ChangePassword: undefined;
  ManageGroup: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{ title: "設定" }}
      />
      <Stack.Screen
        name="ChangeEmail"
        component={ChangeEmailScreen}
        options={{ title: "メールアドレス変更" }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ title: "パスワード変更" }}
      />
      <Stack.Screen
        name="ManageGroup"
        component={ManageGroupScreen}
        options={{ title: "グループ管理" }}
      />
    </Stack.Navigator>
  );
}
