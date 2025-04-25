import React from "react";
import { View } from "react-native";
import { Badge } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export const SettingsIconWithBadge = ({ showBadge, color }) => {
  return (
    <View style={{ width: 24, height: 24 }}>
      <Icon name="cog" size={24} color={color} />
      {showBadge && (
        <Badge
          size={8}
          style={{
            position: "absolute",
            top: -4,
            right: -4,
          }}
        />
      )}
    </View>
  );
};
