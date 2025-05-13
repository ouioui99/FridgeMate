import * as React from "react";
import { Dimensions, Text, View, Image, StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const images = [
  require("../assets/img/carrot_leaf.png"),
  require("../assets/img/carrot_leaf.png"),
  require("../assets/img/carrot_leaf.png"),
  require("../assets/img/carrot_leaf.png"),
  require("../assets/img/carrot_leaf.png"),
];

function OnboardingScreen() {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const [step, setStep] = React.useState(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - step,
      animated: true,
    });
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <Carousel
        ref={ref}
        width={width}
        height={height - 50} // ← ここで下に余裕を作る
        data={images}
        onProgressChange={progress}
        onSnapToItem={(index) => setStep(index)}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={item} style={styles.image} resizeMode="cover" />
          </View>
        )}
      />

      {/* STEP 表示 */}
      <View style={styles.stepContainer}>
        <Text style={styles.stepText}>STEP：{step + 1}</Text>
      </View>

      {/* ページネーション */}
      <View style={styles.paginationContainer}>
        <Pagination.Basic
          progress={progress}
          data={images}
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
          onPress={onPressPagination}
        />
      </View>
    </SafeAreaView>
  );
}

export default OnboardingScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#000",
  },
  slide: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    marginBottom: 50, // ← これだけでOK
  },
  stepContainer: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  stepText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  paginationContainer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },
  dot: {
    backgroundColor: "rgba(255,255,255,0.4)",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#fff",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});
