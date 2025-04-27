import React, { useState } from "react";
import { View, Text, Switch, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Ionicons";
import { SettingsStackParamList } from "../../../screens/SettingsStack";
import { useUserSettings } from "../../../contexts/UserSettingsContext";
import { useInviteNotification } from "../../../hooks/useInviteNotification";
import { signOut } from "../../../lib/supabase/users";

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
          label="最小個数の設定"
          onPress={async () => {
            await signOut();
          }}
        />
      </Section>

      <Section title="ユーザー">
        <SettingLink
          label="メールアドレス変更"
          onPress={() => navigation.navigate("ChangeEmail")}
        />
        <SettingLink
          label="パスワード変更"
          onPress={() => navigation.navigate("ChangePassword")}
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

const SettingToggle = ({
  label,
  value,
  disabled,
  onValueChange,
}: {
  label: string;
  value: boolean;
  disabled: boolean;
  onValueChange: (val: boolean) => void;
}) => (
  <View style={styles.item}>
    <Text style={styles.label}>{label}</Text>
    <Switch value={value} onValueChange={onValueChange} disabled={disabled} />
  </View>
);

const SettingLink = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Text style={styles.label}>{label}</Text>
    <Icon name="chevron-forward" size={20} />
  </TouchableOpacity>
);

const SettingLinkWithBadge = ({
  label,
  onPress,
  showBadge,
}: {
  label: string;
  onPress: () => void;
  showBadge?: boolean;
}) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Text style={styles.label}>{label}</Text>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {showBadge && (
        <View style={styles.rightBadge}>
          <Text style={styles.rightBadgeText}>申請あり</Text>
        </View>
      )}
      <Icon name="chevron-forward" size={20} />
    </View>
  </TouchableOpacity>
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
