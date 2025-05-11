import { View, Text, Switch, StyleSheet } from "react-native";

export const SettingToggle = ({
  label,
  value,
  disabled,
  onValueChange,
}: {
  label: string;
  value: boolean;
  disabled: boolean;
  onValueChange: (val: boolean) => void;
}) => {
  return (
    <View style={styles.item}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} disabled={disabled} />
    </View>
  );
};

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
