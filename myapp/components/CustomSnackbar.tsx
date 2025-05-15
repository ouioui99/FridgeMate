import { Snackbar } from "react-native-paper";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";

export const CustomSnackbar = ({
  visible,
  onDismiss,
  message,
}: {
  visible: boolean;
  onDismiss: () => void;
  message: string;
}) => {
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();

  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      style={{
        position: "absolute",
        bottom: 0,
        left: 16,
        right: 16,
        borderRadius: 8,
      }}
    >
      {message}
    </Snackbar>
  );
};
