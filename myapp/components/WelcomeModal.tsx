import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onPressHowToUse: () => void;
};

export default function WelcomeModal({
  visible,
  onClose,
  onPressHowToUse,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>ようこそ！！</Text>
          <Text style={styles.message}>本アプリの使い方を見ますか？</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
              <Text style={styles.secondaryButtonText}>あとで見る</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onPressHowToUse}
            >
              <Text style={styles.primaryButtonText}>使い方を見る</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  primaryButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#E0E0E0",
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  secondaryButtonText: {
    color: "#333",
    textAlign: "center",
    fontWeight: "600",
  },
});
