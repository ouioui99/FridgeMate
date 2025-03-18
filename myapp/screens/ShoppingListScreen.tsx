import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  PanResponder,
} from "react-native";
import CheckList from "../components/CheckList";

export default function ShoppingListScreen() {
  return (
    <View style={styles.container}>
      <CheckList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#4CAF50",
    paddingTop: 40, // ステータスバーを考慮
    paddingBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  addButton: {
    marginRight: 15,
  },
  loading: {
    marginTop: 20,
  },
});
