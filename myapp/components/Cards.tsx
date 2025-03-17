import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import { Text, Card, Button, Icon } from "@rneui/themed";
import { fridgeTestData } from "../TestData";
import { supabase } from "../lib/supabase/supabase";
import { stocks } from "../types";

type CardsComponentsProps = { stocks: stocks[] };
const numColumns = 2; // 列数を指定
const screenWidth = Dimensions.get("window").width; // 画面幅を取得

const Cards: React.FunctionComponent<CardsComponentsProps> = ({ stocks }) => {
  // カードの幅を計算（画面幅から余白を引いて列数で割る）
  const cardWidth = (screenWidth - 30) / numColumns;

  const renderItem = ({ item, index }) => (
    <View style={{ width: cardWidth, padding: 2 }}>
      <Card containerStyle={styles.cardContainer}>
        {/* タイトル */}
        <Card.Title style={styles.cardTitle}>{item.name}</Card.Title>
        <Card.Divider />

        <View style={styles.cardContent}>
          {/* 画像を左上に小さく表示 */}
          <Image
            style={styles.image}
            resizeMode="cover"
            source={{ uri: item.image }}
          />

          {/* テキスト部分 */}
          <View style={styles.textContainer}>
            {/* 個数を表示（強調を薄く） */}
            <Text style={styles.amount}>{item.amount}</Text>
            {/* 賞味期限を表示 */}
            <Text style={styles.expirationDate}>
              賞味期限: {item.expiration_date}
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );

  return (
    <FlatList
      data={stocks}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      numColumns={numColumns} // 列数を指定
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    //padding: 10,
  },
  cardContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "100%", // カードの幅を親コンテナに合わせる
    padding: 5, // カード内の余白を追加
  },
  cardContent: {
    flexDirection: "row", // 横並びに変更
    alignItems: "flex-start", // 上揃え
  },
  image: {
    width: 40, // 画像を小さく
    height: 40, // 画像を小さく
    borderRadius: 20, // 円形にする
    marginRight: 10, // 画像とテキストの間隔
  },
  textContainer: {
    flex: 1, // テキスト部分を伸ばす
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left", // タイトルを左揃え
    marginBottom: 10, // タイトルと画像の間隔
  },
  amount: {
    fontSize: 20, // 個数のフォントサイズ
    color: "#555", // 強調を薄くする
    marginBottom: 5, // 個数と賞味期限の間隔
  },
  expirationDate: {
    fontSize: 14,
    color: "#666",
  },
});

export default Cards;
