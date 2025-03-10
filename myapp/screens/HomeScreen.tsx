import { View, Text, Button } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View>
      <Text>ホーム画面</Text>
      <Button title="ユーザ" onPress={() => navigation.navigate("User")} />
    </View>
  );
};

export default HomeScreen;
