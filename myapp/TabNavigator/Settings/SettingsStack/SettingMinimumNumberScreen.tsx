import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSession } from "../../../contexts/SessionContext";
import { useGetProfile } from "../../../hooks/useGetProfile";
import {
  fetchReplenishmentSettingsByGroup,
  upsertReplenishmentSetting,
} from "../../../lib/supabase/stockReplenishmentSetting";
import { Stock, StockReplenishmentSetting } from "../../../types/daoTypes";
import { CommonStyles } from "../../../styles/CommonStyles";

type StockWithReplenishmentSetting = StockReplenishmentSetting & {
  stock: Stock;
};

export default function SettingMinimumNumberScreen() {
  const [settings, setSettings] = useState<StockWithReplenishmentSetting[]>([]);
  const [replenishmentValues, setReplenishmentValues] = useState<
    Record<string, string>
  >({});
  const { session } = useSession();
  const userId = session?.user?.id;
  const { data: profile } = useGetProfile(userId);
  const groupId = profile?.current_group_id;

  useEffect(() => {
    const fetchData = async () => {
      if (!groupId) return;

      const settingData = await fetchReplenishmentSettingsByGroup(groupId);
      setSettings(settingData);

      const initialValues: Record<string, string> = {};
      settingData.forEach((setting) => {
        initialValues[setting.stock.id] =
          setting.replenishment_amount?.toString() || "0";
      });
      setReplenishmentValues(initialValues);
    };

    fetchData();
  }, []);

  const handleChange = (stockId: string, value: string) => {
    setReplenishmentValues((prev) => ({ ...prev, [stockId]: value }));
  };

  const handleSave = async () => {
    if (!groupId) return;

    const promises = settings.map((setting) => {
      const stockId = setting.stock.id;
      const value = replenishmentValues[stockId] ?? "0";
      const num = parseInt(value, 10);
      return upsertReplenishmentSetting(groupId, stockId, isNaN(num) ? 0 : num);
    });

    await Promise.all(promises);
    Alert.alert("保存完了", "補充設定を保存しました。");
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {settings.map((setting) => (
          <View key={setting.stock.id} style={styles.itemRow}>
            <Text style={styles.stockName}>{setting.stock.name}</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={replenishmentValues[setting.stock.id]}
              onChangeText={(text) => handleChange(setting.stock.id, text)}
              placeholder="0"
            />
          </View>
        ))}
      </ScrollView>
      <View style={{ marginTop: 16, marginBottom: 18 }}>
        <TouchableOpacity
          style={CommonStyles.completeButton}
          onPress={handleSave}
        >
          <Text style={CommonStyles.completeButtonText}>保存する</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  stockName: {
    fontSize: 16,
    flex: 1,
  },
  input: {
    width: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    textAlign: "right",
  },
  completeButton: {
    backgroundColor: "#4CAF50", // 緑色
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    marginBottom: 20,
  },
  completeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
