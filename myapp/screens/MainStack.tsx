import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { BottomNavigator } from "../components/BottomNavigator";
import HowToUseScreen from "./HowToUseScreen";

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

export default function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={BottomNavigator}
        options={{
          headerShown: false,
        }}
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
