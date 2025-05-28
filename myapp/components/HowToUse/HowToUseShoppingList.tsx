import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextProps,
  TouchableOpacityProps,
  TouchableOpacity,
} from "react-native";
import { CopilotStep } from "react-native-copilot";
import { PaperProvider } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ShoppingList } from "../../types/daoTypes";
import CheckList from "../CheckList";
import { CommonStyles } from "../../styles/CommonStyles";
import HowToUseCheckList from "./HowToUseCheckList";
import { HowToUseCheckListItemRef } from "./HowToUseCheckListItem";

export const dummyShoppingLists: ShoppingList[] = [
  {
    id: "1",
    name: "卵",
    amount: 1,
    checked: false,
    creater_id: "user_123",
    group_id: "group_abc",
    created_at: new Date("2025-05-01T10:00:00Z"),
    updated_at: new Date("2025-05-01T12:00:00Z"),
  },
  {
    id: "2",
    name: "牛乳",
    amount: 2,
    checked: false,
    creater_id: "user_456",
    group_id: "group_abc",
    created_at: new Date("2025-05-02T09:30:00Z"),
    updated_at: new Date("2025-05-02T09:45:00Z"),
  },
  {
    id: "3",
    name: "パン",
    amount: 1,
    checked: true,
    creater_id: "user_123",
    group_id: "group_abc",
    created_at: new Date("2025-05-03T08:00:00Z"),
    updated_at: new Date("2025-05-03T08:10:00Z"),
  },
];

type ShoppingListProps = {
  WalkthroughableView: React.FunctionComponent<TextProps>;
  WalkthroughableTouchableOpacity: React.FunctionComponent<
    TouchableOpacityProps & React.RefAttributes<View>
  >;
  itemRef: React.RefObject<HowToUseCheckListItemRef | null>;
};

export default function HowToUseShoppingList({
  WalkthroughableView,
  WalkthroughableTouchableOpacity,
  itemRef,
}: ShoppingListProps) {
  const [shoppingLists, setShoppingLists] =
    useState<ShoppingList[]>(dummyShoppingLists);

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <CopilotStep
            text="この画面では、買い物リストの一覧を確認・編集できます"
            order={8}
            name="entireScreenShoppingList"
          >
            <WalkthroughableView style={styles.halfContainer}>
              {/* ヘッダー */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>買い物リスト</Text>
                <CopilotStep
                  text="このボタンで買い物リストにアイテムを追加できます"
                  order={9}
                  name="addShoppingListButton"
                >
                  <WalkthroughableTouchableOpacity style={styles.plusButton}>
                    <Text style={styles.plusText}>＋</Text>
                  </WalkthroughableTouchableOpacity>
                </CopilotStep>
              </View>

              <HowToUseCheckList
                shoppingLists={shoppingLists}
                setShoppingLists={setShoppingLists}
                itemRef={itemRef}
              />
            </WalkthroughableView>
          </CopilotStep>
        </View>

        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 16,
            marginBottom: 18,
          }}
        >
          <CopilotStep
            text="このボタンを押下するとチェックがついているアイテムが買い物リストから在庫リストへ移動します"
            order={10}
            name="completeShoppingList"
          >
            <WalkthroughableTouchableOpacity
              style={[CommonStyles.completeButton]}
              // onPress={handleShoppingComplete}
              // disabled={!hasCheckedItem}
            >
              <Text style={CommonStyles.buttonText}>買い物完了</Text>
            </WalkthroughableTouchableOpacity>
          </CopilotStep>
        </View>
        {/* Bottom Navigation */}
        <WalkthroughableView style={styles.bottomNav}>
          <WalkthroughableView style={styles.navItem}>
            <MaterialCommunityIcons name="fridge" size={24} color="#999" />
            <Text style={styles.navLabel}>在庫リスト</Text>
          </WalkthroughableView>

          <View style={styles.navItem}>
            <MaterialCommunityIcons
              name="cart-outline"
              size={24}
              color="#007AFF"
            />
            <Text style={[styles.navLabel, { color: "#007AFF" }]}>
              買い物リスト
            </Text>
          </View>
          <CopilotStep
            text="このボタンを押下すると設定画面へ遷移します"
            order={13}
            name="settingBtn"
          >
            <WalkthroughableView style={styles.navItem}>
              <MaterialCommunityIcons
                name="cog-outline"
                size={24}
                color="#999"
              />
              <Text style={styles.navLabel}>設定</Text>
            </WalkthroughableView>
          </CopilotStep>
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
