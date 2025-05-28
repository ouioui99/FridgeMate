import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { USER_KEY } from "../../constants/settings";
import { useUserSettings } from "../../contexts/UserSettingsContext";
import { useInviteNotification } from "../../hooks/useInviteNotification";
import { signOut } from "../../lib/supabase/users";
import { SettingsStackParamList } from "../../screens/SettingsStack";
import { SettingLink, SettingLinkWithBadge } from "../SettingLink";
import { SettingToggle } from "../SettingToggle";
import { CopilotStep, walkthroughable } from "react-native-copilot";

const WalkthroughableText = walkthroughable(Text);
const WalkthroughableView = walkthroughable(View);
const WalkthroughableTouchableOpacity = walkthroughable(TouchableOpacity);
const WalkthroughableScrollView = walkthroughable(ScrollView);
const HowToUseSettingsMain = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<SettingsStackParamList>>();

  const {
    autoAddToShoppingList,
    setAutoAddToShoppingList,
    isConfirmWhenAutoAddToShoppingList,
    setIsConfirmWhenAutoAddToShoppingList,
  } = useUserSettings();

  const { inviteCodeUses } = useInviteNotification();

  const handleDeleteUser = async () => {
    await SecureStore.deleteItemAsync(USER_KEY);
    await AsyncStorage.removeItem("hasLaunched");
    console.log("complete");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>設定</Text>
      </View>

      {/* 本体 */}
      <ScrollView
        style={{ flex: 0.5, backgroundColor: "#fff", paddingHorizontal: 16 }}
      >
        <CopilotStep
          text="このボタンを押下すると設定画面へ遷移します"
          order={15}
          name="settingBtna"
        >
          <WalkthroughableView style={styles.halfContainer}>
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
          </WalkthroughableView>
        </CopilotStep>
      </ScrollView>

      {/* ボトムナビゲーション */}
      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <MaterialCommunityIcons name="fridge" size={24} color="#999" />
          <Text style={styles.navLabel}>在庫リスト</Text>
        </View>
        <View style={styles.navItem}>
          <MaterialCommunityIcons name="cart-outline" size={24} color="#999" />
          <Text style={styles.navLabel}>買い物リスト</Text>
        </View>
        <View style={styles.navItem}>
          <MaterialCommunityIcons
            name="cog-outline"
            size={24}
            color="#007AFF"
          />
          <Text style={[styles.navLabel, { color: "#007AFF" }]}>設定</Text>
        </View>
      </View>
    </SafeAreaView>
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
  header: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  bottomNav: {
    flexDirection: "row" as const,
    justifyContent: "space-around",
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
  },
  halfContainer: {
    flex: 1,
    paddingBottom: 100,
  },
  navItem: {
    alignItems: "center" as const,
  },
  navLabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
};

export default HowToUseSettingsMain;
