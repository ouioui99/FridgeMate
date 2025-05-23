// styles/CommonStyles.ts
import { StyleSheet } from "react-native";

export const CommonStyles = StyleSheet.create({
  completeButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  completeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomSnackbar: {
    position: "absolute",
    bottom: 0,
    left: 5,
    right: 5,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  inputDisabled: {
    backgroundColor: "#f0f0f0",
    color: "#aaa",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
});
