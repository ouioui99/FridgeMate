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

type ValidationErrors = Record<string, string | undefined>;

export default function SettingMinimumNumberScreen() {
  const [settings, setSettings] = useState<StockWithReplenishmentSetting[]>([]);
  const [replenishmentValues, setReplenishmentValues] = useState<
    Record<string, string>
  >({});
  const [replenishmentSelections, setReplenishmentSelections] = useState<
    Record<string, { start: number; end: number } | undefined>
  >({});
  const [validationError, setValidationError] = useState<ValidationErrors>({});
  const { session } = useSession();
  const userId = session?.user?.id;
  const { data: profile } = useGetProfile(userId);
  const groupId = profile?.current_group_id;
  const [initialValues, setInitialValues] = useState<Record<string, string>>(
    {}
  );

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
      setInitialValues(initialValues); // 初期値を保存
    };

    fetchData();
  }, []);

  // 「変更があるかどうか」の判定関数
  const isChanged = () => {
    // stockId ごとに初期値と現在値が違うかを判定
    for (const stockId of Object.keys(initialValues)) {
      if (
        (replenishmentValues[stockId] ?? "") !== (initialValues[stockId] ?? "")
      ) {
        return true; // どれか1つでも違えば変更あり
      }
    }
    return false; // すべて同じなら変更なし
  };

  // バリデーションにエラーがあるかどうかを判定
  const hasValidationError = Object.values(validationError).some(
    (v) => v !== undefined
  );

  // ボタンを押せる条件：変更ありかつエラーなし
  const canSave = isChanged() && !hasValidationError;

  const handleChange = (stockId: string, value: string) => {
    setReplenishmentValues((prev) => ({ ...prev, [stockId]: value }));

    // バリデーションチェック
    let errorMsg: string | undefined;
    if (value.trim() === "") {
      errorMsg = "必須入力です";
    } else if (!/^\d+$/.test(value)) {
      errorMsg = "数字のみ入力してください";
    } else if (parseInt(value, 10) <= 0) {
      errorMsg = "1以上の値を入力してください";
    }

    setValidationError((prev) => ({ ...prev, [stockId]: errorMsg }));
  };

  const handleSave = async () => {
    if (!groupId) return;

    // 保存前にエラーがあれば止める
    const hasError = Object.values(validationError).some(
      (v) => v !== undefined
    );
    if (hasError) {
      Alert.alert("エラー", "入力内容に誤りがあります。修正してください。");
      return;
    }

    // バリデーションに引っかかる値がないか再チェック
    for (const [stockId, value] of Object.entries(replenishmentValues)) {
      if (value.trim() === "" || isNaN(Number(value)) || Number(value) <= 0) {
        Alert.alert("エラー", "入力内容に誤りがあります。修正してください。");
        return;
      }
    }

    // 保存処理
    const promises = settings.map((setting) => {
      const stockId = setting.stock.id;
      const value = replenishmentValues[stockId] ?? "0";
      const num = parseInt(value, 10);
      return upsertReplenishmentSetting(groupId, stockId, isNaN(num) ? 0 : num);
    });

    await Promise.all(promises);
    Alert.alert("保存完了", "補充設定を保存しました。");
    setInitialValues({ ...replenishmentValues });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {settings.map((setting) => {
          const stockId = setting.stock.id;
          return (
            <View key={stockId} style={styles.itemRow}>
              <Text style={styles.stockName}>{setting.stock.name}</Text>
              <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
                <TextInput
                  style={[
                    styles.input,
                    validationError[stockId] && { borderColor: "red" },
                  ]}
                  keyboardType="number-pad"
                  value={replenishmentValues[stockId]}
                  onChangeText={(text) => handleChange(stockId, text)}
                  placeholder="1"
                  onFocus={() => {
                    const value = replenishmentValues[stockId] ?? "";
                    setReplenishmentSelections((prev) => ({
                      ...prev,
                      [stockId]: { start: 0, end: value.length },
                    }));
                  }}
                  selection={replenishmentSelections[stockId]}
                />
                {validationError[stockId] && (
                  <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
                    {validationError[stockId]}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
      <View style={{ marginTop: 16, marginBottom: 18 }}>
        <TouchableOpacity
          style={[
            CommonStyles.completeButton,
            !canSave && { backgroundColor: "#ccc" }, // 無効時は薄いグレーに変えるなど
          ]}
          onPress={handleSave}
          disabled={!canSave} // ここで無効化
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
