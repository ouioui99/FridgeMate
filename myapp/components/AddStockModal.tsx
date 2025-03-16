import React, { useState } from "react";
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { supabase } from "../lib/supabase";

interface AddStockModalProps {
  visible: boolean;
  onClose: () => void;
  onStockAdded: () => void;
}

const AddStockModal: React.FC<AddStockModalProps> = ({
  visible,
  onClose,
  onStockAdded,
}) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [image, setImage] = useState("");

  const handleAddStock = async () => {
    if (!name || !amount || !expirationDate) {
      alert("全ての項目を入力してください");
      return;
    }

    const { data, error } = await supabase.from("stocks").insert([
      {
        name,
        amount: Number(amount),
        expiration_date: expirationDate,
        image,
      },
    ]);

    if (error) {
      console.error("Error adding stock:", error.message);
      return;
    }

    onStockAdded();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>在庫を追加</Text>

          <TextInput
            style={styles.input}
            placeholder="名前"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="個数"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <TextInput
            style={styles.input}
            placeholder="賞味期限 (YYYY-MM-DD)"
            placeholderTextColor="#888"
            value={expirationDate}
            onChangeText={setExpirationDate}
          />

          <TextInput
            style={styles.input}
            placeholder="画像URL (任意)"
            placeholderTextColor="#888"
            value={image}
            onChangeText={setImage}
          />

          {/* 追加ボタン */}
          <TouchableOpacity style={styles.addButton} onPress={handleAddStock}>
            <Text style={styles.addButtonText}>追加</Text>
          </TouchableOpacity>

          {/* 閉じるボタン（余白を追加して距離を広げる） */}
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
    backgroundColor: "rgba(0,0,0,0.4)", // 背景を半透明に
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
    marginTop: 15, // 追加ボタンと閉じるボタンの間隔を広げる
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 15, // キャンセルボタンの位置をさらに下げる
    padding: 10,
  },
  closeButtonText: {
    color: "#777",
    fontSize: 16,
  },
});

export default AddStockModal;
