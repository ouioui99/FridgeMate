import { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import {
  SafeAreaInsetsContext,
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import { CommonStyles } from "../styles/CommonStyles";
import { initializeUser } from "../lib/supabase/users";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Card, PaperProvider } from "react-native-paper";

const { width, height } = Dimensions.get("window");

export default function HowToUseScreen() {
  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <View style={styles.headerSpacer} /> {/* 左のスペース */}
          <Text style={styles.headerTitle}>在庫リスト</Text>{" "}
          {/* 中央タイトル */}
          <TouchableOpacity>
            <Text style={styles.plusButton}>＋</Text> {/* 右のボタン */}
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          {/* カード */}
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.itemTitle}>てすと</Text>
              <View style={styles.separator} />

              <View style={styles.itemRow}>
                <Image
                  source={{
                    uri: "https://em-content.zobj.net/thumbs/120/apple/354/grapes_1f347.png",
                  }}
                  style={styles.emojiImage}
                />
                <View style={styles.counterBox}>
                  <TouchableOpacity style={styles.counterButton}>
                    <Text style={styles.counterText}>－</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>2</Text>
                  <TouchableOpacity style={styles.counterButton}>
                    <Text style={styles.counterText}>＋</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Bottom Navigation（ダミー） */}
        <View style={styles.bottomNav}>
          <View style={styles.navItem}>
            <MaterialCommunityIcons name="fridge" size={24} color="#007AFF" />
            <Text style={[styles.navLabel, { color: "#007AFF" }]}>
              在庫リスト
            </Text>
          </View>
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
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // ← これがポイント
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    flex: 1, // ← これで中央に配置されやすくなる
  },
  plusButton: {
    fontSize: 24,
    color: "#007AFF",
  },
  card: {
    margin: 16,
    borderRadius: 16,
    elevation: 3,
  },
  itemTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  emojiImage: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  counterBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  counterButton: {
    backgroundColor: "#eee",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  counterText: {
    fontSize: 20,
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 20,
    fontWeight: "600",
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
