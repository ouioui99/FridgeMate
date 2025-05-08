import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Platform,
  FlatList,
  Animated,
} from "react-native";
import { stocks } from "../types/daoTypes";
import { FormModalProps } from "../types/formModalTypes";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import EmojiKeyboard, { ja } from "rn-emoji-keyboard";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useSession } from "../contexts/SessionContext";
import { useGetProfile } from "../hooks/useGetProfile";
import { fetchStocks } from "../lib/supabase/stocks";

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
  const [query, setQuery] = useState("");
  const { session, loading } = useSession();
  const userId = session?.user?.id;
  const { data: profile, isLoading, error } = useGetProfile(userId);
  const data = ["test", "test2", "test3"];
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [stocks, setStocks] = useState<stocks>([]);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [currentEmojiField, setCurrentEmojiField] = useState<string | null>(
    null
  );

  // 編集モードかどうか判定（id の有無 or initialData が空かどうか）
  const isEditMode: boolean =
    "id" in initialData && initialData.id ? true : false;

  useEffect(() => {
    const fetch = async () => {
      if (!profile) return;
      const data = await fetchStocks(profile.current_group_id);
      setStocks(data);
    };
    if (visible) {
      fetch();
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

  useEffect(() => {
    if (isInputFocused && filteredSuggestions.length > 0) {
      // 一度値をリセット
      opacity.setValue(0);
      translateY.setValue(-10);

      // アニメーション開始
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // フェードアウトのみ
      Animated.timing(opacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [isInputFocused, filteredSuggestions]);

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
  //画像保存時に使用
  // const handleOnPressImage = async (key: string) => {
  //   const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaType,
  //     allowsEditing: true,
  //     aspect: [1, 1],
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     // ファイルシステムに保存する際、拡張子を追加
  //     const fileExtension = result.assets[0].uri.split(".").pop();
  //     const to = tempDir + "thumbnail_" + timestamp + "." + fileExtension;

  //     try {
  //       // ファイルをコピーする
  //       await FileSystem.copyAsync({
  //         from: result.assets[0].uri,
  //         to,
  //       });

  //       // 保存した画像のパスを設定
  //       setFormData((prev) => ({ ...prev, [key]: to }));
  //     } catch (error) {
  //       console.error("Error copying file:", error);
  //     }
  //   }
  // };

  const handleChange = (key: string, value: string, label?: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    if (label === "買い物アイテム") {
      const stockNameList = stocks.map((stock) => stock.name);
      const filtered = stockNameList.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionPress = (key: string, item: string) => {
    setFormData((prev) => ({ ...prev, [key]: item }));
    setIsInputFocused(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>データを登録</Text>

          {fields.map(({ key, label, placeholder, type }) => {
            if (label === "image") {
              return (
                <TouchableOpacity
                  key={key}
                  style={styles.imageInput}
                  onPress={() => {
                    setIsEmojiPickerOpen(true);
                  }}
                >
                  <View style={styles.imagePreviewContainer}>
                    {formData[key]?.toString() ? (
                      <Text style={{ fontSize: 40 }}>{formData[key]}</Text>
                    ) : (
                      <>
                        <Icon name="emoticon-outline" size={30} color="#999" />
                        <Text style={styles.imagePlaceholderText}>
                          {placeholder}
                        </Text>
                      </>
                    )}
                  </View>
                  <EmojiKeyboard
                    onEmojiSelected={(emoji) => {
                      setFormData((prev) => ({
                        ...prev,
                        [key]: emoji.emoji,
                      }));
                      setIsEmojiPickerOpen(false);
                    }}
                    open={isEmojiPickerOpen}
                    onClose={() => setIsEmojiPickerOpen(false)}
                    translation={ja}
                    categoryOrder={["food_drink"]}
                    enableSearchBar
                  />
                </TouchableOpacity>
              );
            } else if (label === "買い物アイテム") {
              const suggestions = ["肉", "野菜", "調味料", "飲み物"];
              return (
                <React.Fragment key={key}>
                  <TextInput
                    key={key}
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#888"
                    value={formData[key]?.toString() || ""}
                    keyboardType={type === "number" ? "numeric" : "default"}
                    onChangeText={(text) => handleChange(key, text, label)}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => {
                      setIsInputFocused(false);
                    }}
                  />
                  {isInputFocused &&
                    filteredSuggestions.length > 0 &&
                    formData[key]?.length > 0 && (
                      <Animated.View
                        style={[
                          styles.suggestionList,
                          {
                            opacity,
                            transform: [{ translateY }],
                          },
                        ]}
                      >
                        <FlatList
                          key={key}
                          data={filteredSuggestions}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({ item }) => (
                            <TouchableOpacity
                              onPress={() => handleSuggestionPress(key, item)}
                              style={styles.suggestionItem}
                            >
                              <Text>{item}</Text>
                            </TouchableOpacity>
                          )}
                          keyboardShouldPersistTaps="handled"
                        />
                      </Animated.View>
                    )}
                </React.Fragment>
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
  suggestionList: {
    width: "100%", // ← 追加
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    maxHeight: 100,
    marginTop: -10,
    marginBottom: 10,
    borderRadius: 4,
    zIndex: 1,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});

export default FormModal;
