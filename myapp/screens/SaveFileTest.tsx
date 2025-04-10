import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React, { useState, useEffect } from "react";
import { View, Image, Platform, Button } from "react-native";

const SettingsScreen = () => {
  const tempDir = FileSystem.cacheDirectory + "silhouette-quiz/"; // tempDirの定義
  const [questionImage, setQuestionImage] = useState<string | undefined>();

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

  const handleClickQuestionImagePickButton = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      allowsEditing: true,
      aspect: [4, 3],
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
        setQuestionImage(to);
      } catch (error) {
        console.error("Error copying file:", error);
      }
    } else {
      console.log("Image picker was canceled.");
    }
  };

  return (
    <View>
      {questionImage && (
        <Image
          source={{ uri: questionImage }}
          style={{ width: 200, height: 200 }}
        />
      )}
      {/* 画像が選択されていない場合、画像は表示しない */}
      <Button
        title="Pick an Image"
        onPress={handleClickQuestionImagePickButton}
      />
    </View>
  );
};

export default SettingsScreen;
