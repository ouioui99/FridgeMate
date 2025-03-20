import React, { useState } from "react";
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { FormModalProps } from "../types/formModalTypes";

const FormModal = <T extends Record<string, any>>({
  visible,
  onClose,
  fields,
  onSubmit,
}: FormModalProps<T>) => {
  const [formData, setFormData] = useState<Partial<T>>({});

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleConfirm = async () => {
    try {
      await onSubmit(formData as T);
      setFormData({});
      onClose();
    } catch (error) {
      console.error(error);
      alert("登録に失敗しました");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>データを登録</Text>

          {fields.map(({ key, label, placeholder, type }) => (
            <TextInput
              key={key}
              style={styles.input}
              placeholder={placeholder}
              placeholderTextColor="#888"
              value={formData[key]?.toString() || ""}
              keyboardType={type === "number" ? "numeric" : "default"}
              onChangeText={(text) => handleChange(key, text)}
            />
          ))}

          <TouchableOpacity style={styles.addButton} onPress={handleConfirm}>
            <Text style={styles.addButtonText}>登録</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>キャンセル</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  addButton: {
    width: "100%",
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
  },
  closeButtonText: {
    color: "#777",
    fontSize: 16,
  },
});

export default FormModal;
