import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export const SettingLink = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Text style={styles.label}>{label}</Text>
    <Icon name="chevron-forward" size={20} />
  </TouchableOpacity>
);

export const SettingLinkWithBadge = ({
  label,
  onPress,
  showBadge,
}: {
  label: string;
  onPress: () => void;
  showBadge?: boolean;
}) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Text style={styles.label}>{label}</Text>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {showBadge && (
        <View style={styles.rightBadge}>
          <Text style={styles.rightBadgeText}>申請あり</Text>
        </View>
      )}
      <Icon name="chevron-forward" size={20} />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
  },
  label: {
    fontSize: 16,
  },
  rightBadge: {
    backgroundColor: "red",
    borderRadius: 12,
    paddingHorizontal: 6,
    marginRight: 8,
  },
  rightBadgeText: {
    color: "white",
    fontSize: 12,
  },
});
