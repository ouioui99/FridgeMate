import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import { Card } from "@rneui/themed";
import { Stock, stocks } from "../types/daoTypes";
import { Ionicons } from "@expo/vector-icons";

type CardsComponentsProps = {
  stocks: stocks;
  handleUpdateAmount: (stockId: string, newAmount: number) => void;
  handleClickCard: (item: Stock) => void;
};

const numColumns = 2; // 列数を指定
const screenWidth = Dimensions.get("window").width; // 画面幅を取得

const Cards: React.FunctionComponent<CardsComponentsProps> = ({
  stocks,
  handleUpdateAmount,
  handleClickCard,
}) => {
  // 個数を管理する状態
  const [itemAmounts, setItemAmounts] = useState<{ [key: string]: number }>({});

  // カードの幅を計算（画面幅から余白を引いて列数で割る）
  const cardWidth = (screenWidth - 30) / numColumns;

  const renderItem = ({ item }: { item: Stock }) => (
    <View style={{ width: cardWidth, padding: 2 }}>
      <TouchableOpacity
        onPress={() => {
          handleClickCard(item);
        }}
        activeOpacity={0.9} // 押した感が出るように
      >
        <Card containerStyle={styles.cardContainer}>
          {/* タイトル */}
          <Card.Title style={styles.cardTitle}>{item.name}</Card.Title>
          <Card.Divider />

          <View style={styles.cardContent}>
            <Text style={styles.emoji}>{item.image || "📦"}</Text>

            {/* テキスト部分 */}
            <View style={styles.textContainer}>
              {/* 個数の増減 */}
              <View style={styles.amountContainer}>
                <TouchableOpacity
                  style={styles.squareButton}
                  onPress={() => {
                    const currentAmount = itemAmounts[item.id] || item.amount;
                    handleUpdateAmount(item.id, Math.max(currentAmount - 1, 0));
                  }}
                >
                  <Ionicons name="remove-outline" size={17} />
                </TouchableOpacity>

                <Text style={styles.amount}>
                  {itemAmounts[item.id] || item.amount}
                </Text>

                <TouchableOpacity
                  style={styles.squareButton}
                  onPress={() => {
                    const currentAmount = itemAmounts[item.id] || item.amount;
                    handleUpdateAmount(item.id, currentAmount + 1);
                  }}
                >
                  <Text style={styles.buttonText}>
                    <Ionicons name="add-outline" size={17} />
                  </Text>
                </TouchableOpacity>
              </View>

              {/* 賞味期限 */}
              {/* <Text style={styles.expirationDate}>
                賞味期限: {item.expiration_date}
              </Text> */}
            </View>
          </View>
        </Card>
      </TouchableOpacity>
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "100%",
    padding: 12,
    backgroundColor: "#fff",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "left",
    marginBottom: 8,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 6,
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    minWidth: 30,
    textAlign: "center",
  },
  expirationDate: {
    fontSize: 14,
    color: "#777",
    fontWeight: "600",
    textAlign: "left",
  },
  squareButton: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 7,
    paddingHorizontal: 9,
    borderRadius: 6,
  },
  buttonText: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold",
  },
  emoji: {
    fontSize: 36,
    marginRight: 12,
  },
});

export default Cards;
