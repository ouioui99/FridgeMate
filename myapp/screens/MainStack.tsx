import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { BottomNavigator } from "../components/BottomNavigator";
import HowToUseScreen from "./HowToUseScreen";

export type SettingsStackParamList = {
  ChangeEmail: undefined;
  ChangePassword: undefined;
  ManageGroupMember: undefined;
  ManageGroup: undefined;
  SettingsMain: undefined;
  SettingMinimumNumber: undefined;
  Settings: undefined;
  HowToUse: { previousScreenName: string };
};

export type RootStackParamList = {
  Home: {
    screen?: keyof SettingsStackParamList;
    params?: SettingsStackParamList[keyof SettingsStackParamList];
  };
  HowToUse: { previousScreenName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

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
