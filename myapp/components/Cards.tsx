import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Text,
  Animated,
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
  const [itemAmounts, setItemAmounts] = useState<{ [key: string]: number }>({});
  const [animations] = useState<{ [key: string]: Animated.Value }>(() =>
    Object.fromEntries(stocks.map((item) => [item.id, new Animated.Value(1)]))
  );

  const animateAmount = (id: string) => {
    if (!animations[id]) return;

    animations[id].setValue(1);
    Animated.sequence([
      Animated.timing(animations[id], {
        toValue: 1.4,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animations[id], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const cardWidth = (screenWidth - 30) / numColumns;

  const renderItem = ({ item }: { item: Stock }) => {
    if (!animations[item.id]) {
      animations[item.id] = new Animated.Value(1);
    }

    const currentAmount = itemAmounts[item.id] ?? item.amount;

    return (
      <View style={{ width: cardWidth, padding: 2 }}>
        <TouchableOpacity
          onPress={() => handleClickCard(item)}
          activeOpacity={0.9}
        >
          <Card containerStyle={styles.cardContainer}>
            <Card.Title style={styles.cardTitle}>{item.name}</Card.Title>
            <Card.Divider />

            <View style={styles.cardContent}>
              <Text style={styles.emoji}>{item.image || "📦"}</Text>

              <View style={styles.textContainer}>
                <View style={styles.amountContainer}>
                  <TouchableOpacity
                    style={styles.squareButton}
                    onPress={() => {
                      handleUpdateAmount(
                        item.id,
                        Math.max(currentAmount - 1, 0)
                      );
                      animateAmount(item.id);
                    }}
                  >
                    <Ionicons name="remove-outline" size={17} />
                  </TouchableOpacity>

                  <Animated.Text
                    style={[
                      styles.amount,
                      {
                        transform: [{ scale: animations[item.id] }],
                      },
                    ]}
                  >
                    {currentAmount}
                  </Animated.Text>

                  <TouchableOpacity
                    style={styles.squareButton}
                    onPress={() => {
                      handleUpdateAmount(item.id, currentAmount + 1);
                      animateAmount(item.id);
                    }}
                  >
                    <Ionicons name="add-outline" size={17} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Card>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      data={stocks}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
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
