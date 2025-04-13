import React, { useState } from "react";
import { View, Text, Switch, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Ionicons";
import { SettingsStackParamList } from "../../../screens/SettingsStack";
import { useUserSettings } from "../../../contexts/UserSettingsContext";

const SettingsMain = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<SettingsStackParamList>>();

  const {
    autoAddToShoppingList,
    setAutoAddToShoppingList,
    isConfirmWhenAutoAddToShoppingList,
    setIsConfirmWhenAutoAddToShoppingList,
  } = useUserSettings();

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
        <SettingLink label="最小個数の設定" onPress={() => {}} />
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
        <SettingLink label="ユーザ招待" onPress={() => {}} />
        <SettingLink label="グループ管理" onPress={() => {}} />
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
};

export default SettingsMain;
