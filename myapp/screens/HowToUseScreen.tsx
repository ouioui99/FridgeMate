import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { PaperProvider } from "react-native-paper";
import Cards from "../components/Cards"; // ← your custom component
import { Stock } from "../types/daoTypes";
import {
  CopilotProvider,
  CopilotStep,
  useCopilot,
  walkthroughable,
} from "react-native-copilot";
import HowToUseCards from "../components/HowToUse/HowToUseCards";

const { width } = Dimensions.get("window");

const dummyStocks: Stock[] = [
  {
    id: "1",
    name: "ぶどう",
    image: "🍇",
    amount: 2,
    expiration_date: "2025-06-01",
  },
  {
    id: "2",
    name: "みかん",
    image: "🍊",
    amount: 1,
    expiration_date: "2025-06-02",
  },
  // 必要に応じて追加
];

const WalkthroughableText = walkthroughable(Text);
const WalkthroughableView = walkthroughable(View);
const WalkthroughableTouchableOpacity = walkthroughable(TouchableOpacity);

export default function HowToUseScreen() {
  const [stocks, setStocks] = useState<Stock[]>(dummyStocks);
  const { start, copilotEvents, currentStepNumber } = useCopilot();

  // const isMounted = useIsMounted();

  // useEffect(() => {
  //   const startTutolial = async () => {
  //     await start();
  //   };
  //   startTutolial().then(() => {});
  // }, []);

  const handleUpdateAmount = (stockId: string, newAmount: number) => {
    setStocks((prev) =>
      prev.map((stock) =>
        stock.id === stockId ? { ...stock, amount: newAmount } : stock
      )
    );
  };

  const handleClickCard = (item: Stock) => {
    start();
    console.log("Clicked item:", item.name);
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.container} onLayout={() => start()}>
          <CopilotStep
            text="この画面では、在庫の一覧を確認・編集できます"
            order={1}
            name="entireScreen"
          >
            <WalkthroughableView style={styles.halfContainer}>
              {/* ヘッダー */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>在庫リスト</Text>
                <CopilotStep
                  text="このボタンで在庫を追加できます"
                  order={2}
                  name="stockAddButton"
                >
                  <WalkthroughableTouchableOpacity style={styles.plusButton}>
                    <Text style={styles.plusText}>＋</Text>
                  </WalkthroughableTouchableOpacity>
                </CopilotStep>
              </View>

              {/* カード一覧 */}
              <View style={{ flex: 1 }}>
                <HowToUseCards
                  stocks={stocks}
                  handleUpdateAmount={handleUpdateAmount}
                  handleClickCard={handleClickCard}
                />
              </View>
            </WalkthroughableView>
          </CopilotStep>
        </View>
        {/* Bottom Navigation */}
        <WalkthroughableView style={styles.bottomNav}>
          <WalkthroughableView style={styles.navItem}>
            <MaterialCommunityIcons name="fridge" size={24} color="#007AFF" />
            <Text style={[styles.navLabel, { color: "#007AFF" }]}>
              在庫リスト
            </Text>
          </WalkthroughableView>

          <View style={styles.navItem}>
            <MaterialCommunityIcons
              name="cart-outline"
              size={24}
              color="#999"
            />
            <Text style={styles.navLabel}>買い物リスト</Text>
          </View>
          <View style={styles.navItem}>
            <MaterialCommunityIcons name="cog-outline" size={24} color="#999" />
            <Text style={styles.navLabel}>設定</Text>
          </View>
        </WalkthroughableView>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  halfContainer: {
    flex: 0.8,
    backgroundColor: "#f2f2f2",
  },
  header: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff",
    position: "relative",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  plusButton: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  plusText: {
    fontSize: 24,
    color: "#007AFF",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
  },
  navItem: {
    alignItems: "center",
  },
  navLabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
});
