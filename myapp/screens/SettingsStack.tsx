// screens/SettingsStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsScreen from "../TabNavigator/Settings/SettingsStack/SettingsMain";
import ChangeEmailScreen from "../TabNavigator/Settings/SettingsStack/ChangeEmailScreen";
import ChangePasswordScreen from "../TabNavigator/Settings/SettingsStack/ChangePasswordScreen";
import ManageGroupScreen from "../TabNavigator/Settings/SettingsStack/ManageGroupScreen";
import ManageGroupMemberScreen from "../TabNavigator/Settings/SettingsStack/ManageGroupMemberScreen";
import SettingMinimumNumberScreen from "../TabNavigator/Settings/SettingsStack/SettingMinimumNumberScreen";
import { SettingsStackParamList } from "./MainStack";

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
        name="SettingMinimumNumber"
        component={SettingMinimumNumberScreen}
        options={{ title: "最小個数単位の設定" }}
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
      <Stack.Screen
        name="ManageGroupMember"
        component={ManageGroupMemberScreen}
        options={{ title: "グループメンバー管理" }}
      />
    </Stack.Navigator>
  );
}
