import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useUserSettings } from "../../../contexts/UserSettingsContext";
import { useInviteNotification } from "../../../hooks/useInviteNotification";
import { SettingToggle } from "../../../components/SettingToggle";
import {
  SettingLink,
  SettingLinkWithBadge,
} from "../../../components/SettingLink";
import { SettingsStackParamList } from "../../../screens/MainStack";

const SettingsMain = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<SettingsStackParamList>>();

  const {
    autoAddToShoppingList,
    setAutoAddToShoppingList,
    isConfirmWhenAutoAddToShoppingList,
    setIsConfirmWhenAutoAddToShoppingList,
  } = useUserSettings();

  const { inviteCodeUses } = useInviteNotification();

  const handleSeeTutorial = () => {
    navigation.navigate("HowToUse", {
      previousScreenName: "SettingsMain",
    });
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 }}
    >
      <Section title="在庫/買い物リスト">
        <SettingToggle
          disabled={false}
          label="自動で買い物リストに追加"
          value={autoAddToShoppingList}
          onValueChange={setAutoAddToShoppingList}
        />
        <SettingToggle
          disabled={!autoAddToShoppingList}
          label="自動で買い物リストに追加時に確認"
          value={isConfirmWhenAutoAddToShoppingList}
          onValueChange={setIsConfirmWhenAutoAddToShoppingList}
        />
        <SettingLink
          label="在庫の最小単位の設定"
          onPress={() => navigation.navigate("SettingMinimumNumber")}
        />
      </Section>

      <Section title="グループ">
        <SettingLink
          label="グループ管理"
          onPress={() => navigation.navigate("ManageGroup")}
        />
        <SettingLinkWithBadge
          label="グループメンバー管理"
          onPress={() => navigation.navigate("ManageGroupMember")}
          showBadge={0 < inviteCodeUses.length}
        />
      </Section>

      <View
        style={{
          borderTopWidth: 0.5,
          borderColor: "#ccc",
          padding: 16,
          backgroundColor: "#fff",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => handleSeeTutorial()}
          style={{
            backgroundColor: "#4CAF50",
            paddingVertical: 12,
            paddingHorizontal: 32,
            marginTop: 130,
            borderRadius: 8,
            minWidth: "10%",
          }}
        >
          <Text style={{ color: "white", fontSize: 16, textAlign: "center" }}>
            使い方説明を見る
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) => (
  <View style={{ marginTop: 32 }}>
    <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
      {title}
    </Text>
    {children}
  </View>
);

const styles = {
  item: {
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
  },
  label: {
    fontSize: 16,
  },
  rightBadge: {
    backgroundColor: "red",
    borderRadius: 12,
    paddingHorizontal: 6,
    marginRight: 8,
  },
  rightBadgeText: {
    color: "white",
    fontSize: 12,
  },
};

export default SettingsMain;
