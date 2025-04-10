import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import { FormModalProps } from "../types/formModalTypes";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

const FormModal = <T extends Record<string, any>>({
  visible,
  onClose,
  fields,
  onSubmit,
  handleDelete,
  initialData = {},
}: FormModalProps<T>) => {
  const [formData, setFormData] = useState<Partial<T>>(initialData);
  const tempDir = FileSystem.cacheDirectory + "fridgemate/";

  // 編集モードかどうか判定（id の有無 or initialData が空かどうか）
  const isEditMode: boolean =
    "id" in initialData && initialData.id ? true : false;

  useEffect(() => {
    if (visible) {
      setFormData(initialData); // ← 表示時に初期データをセット
    }
  }, [visible]);

  useEffect(() => {
    // tempDirが存在しない場合、ディレクトリを作成
    FileSystem.getInfoAsync(tempDir).then((dirInfo) => {
      if (!dirInfo.exists) {
        FileSystem.makeDirectoryAsync(tempDir, { intermediates: true }); // 修正: documentDirではなくtempDirを使う
      }
    });

    // モバイルプラットフォームでのみ、カメラロールの権限をリクエスト
    if (Platform.OS !== "web") {
      ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
        if (!status.granted) {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      });
    }
  }, []);

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
      alert(isEditMode ? "更新に失敗しました" : "登録に失敗しました");
    }
  };
  const handleOnPressImage = async (key: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      // ファイルシステムに保存する際、拡張子を追加
      const fileExtension = result.assets[0].uri.split(".").pop();
      const to = tempDir + "question_image." + fileExtension;

      try {
        // ファイルをコピーする
        await FileSystem.copyAsync({
          from: result.assets[0].uri,
          to,
        });

        // 保存した画像のパスを設定
        setFormData((prev) => ({ ...prev, [key]: to }));
      } catch (error) {
        console.error("Error copying file:", error);
      }
    } else {
      console.log("Image picker was canceled.");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>データを登録</Text>

          {fields.map(({ key, label, placeholder, type }) => {
            if (type === "image") {
              return (
                <TouchableOpacity
                  onPress={() => handleOnPressImage(key)}
                  key={key}
                  style={styles.imageInput}
                >
                  <View style={styles.imagePreviewContainer}>
                    {formData[key]?.toString() ? (
                      <Image
                        style={styles.Photo}
                        source={{ uri: formData[key]?.toString() }}
                      />
                    ) : (
                      <>
                        <Icon name="camera-plus" size={30} color="#999" />
                        <Text style={styles.imagePlaceholderText}>
                          画像を追加
                        </Text>
                      </>
                    )}
                  </View>
                </TouchableOpacity>
              );
            } else {
              return (
                <TextInput
                  key={key}
                  style={styles.input}
                  placeholder={placeholder}
                  placeholderTextColor="#888"
                  value={formData[key]?.toString() || ""}
                  keyboardType={type === "number" ? "numeric" : "default"}
                  onChangeText={(text) => handleChange(key, text)}
                />
              );
            }
          })}

          <TouchableOpacity style={styles.addButton} onPress={handleConfirm}>
            <Text style={styles.addButtonText}>
              {isEditMode ? "更新" : "登録"}
            </Text>
          </TouchableOpacity>

          {isEditMode && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>削除</Text>
            </TouchableOpacity>
          )}

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
  deleteButton: {
    width: "100%",
    backgroundColor: "#f44336", // 削除ボタンは赤
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  deleteButtonText: {
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
  iconButton: {
    borderWidth: 1,
    width: 100,
    height: 100,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 30,
  },
  icon: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: "auto",
  },
  Photo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover", // 画像をはみ出さずに埋める
    borderRadius: 12, // 角丸を imageInput に合わせる場合
  },
  imageInput: {
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: "#fafafa",
  },

  imagePreviewContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },

  imagePlaceholderText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
    textAlign: "center",
  },
});

export default FormModal;
