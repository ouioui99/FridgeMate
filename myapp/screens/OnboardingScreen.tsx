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

const { width, height } = Dimensions.get("window");

const onboardingData = [
  {
    title: "食材のムダを減らそう",
    description: "冷蔵庫の中身を簡単に管理して、腐らせない生活へ。",
    image: require("../assets/img/carrot_leaf.png"),
  },
  {
    title: "食材の残りをいつでも確認",
    description: "スマホひとつで在庫チェック。買い忘れ・二重買いを防止！",
    image: require("../assets/img/carrot_leaf.png"),
  },
  {
    title: "家族とシェアして便利に",
    description: "家族みんなで使えるから、無駄がなくなる！",
    image: require("../assets/img/carrot_leaf.png"),
  },
  {
    title: "さあ、始めよう",
    description: "1分で完了！今すぐ冷蔵庫をスッキリ管理しよう。",
    image: require("../assets/img/carrot_leaf.png"),
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef<ICarouselInstance>(null);

  const handleSkip = () => {
    if (!ref?.current) return;
    const currentIndex = ref.current.getCurrentIndex();

    ref.current?.scrollTo({
      count: onboardingData.length - 1 - currentIndex,
      animated: true,
    });
  };

  const handleStart = async () => {
    await initializeUser();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          height: 40,
          paddingHorizontal: 20,
        }}
      >
        {currentIndex < onboardingData.length - 1 ? (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>スキップ</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} /> // ← スキップボタンと同じ幅の空View
        )}
      </View>
      <Carousel
        width={width}
        ref={ref}
        height={height * 0.7}
        data={onboardingData}
        onSnapToItem={setCurrentIndex}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      <View style={styles.pagination}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>

      {currentIndex < onboardingData.length - 1 ? (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            ref?.current?.next();
          }}
        >
          <Text style={styles.buttonText}>次へ</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => {
            handleStart();
          }}
        >
          <Text style={styles.completeButtonText}>はじめる</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  skipButton: {
    zIndex: 10,
  },
  skipText: {
    color: "#007AFF",
    fontSize: 16,
  },
  slide: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 70,
  },
  image: {
    width: "80%",
    height: height * 0.4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginTop: 30,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666666",
    marginTop: 20,
    textAlign: "center",
    lineHeight: 22,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: height * 0.05,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#CCCCCC",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#007AFF",
  },
  button: {
    backgroundColor: "#FF4B4B",
    borderRadius: 12,
    marginHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  completeButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    marginHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center",
  },
  completeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
