import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Snackbar } from "react-native-paper";
import * as Clipboard from "expo-clipboard";
import {
  appliedGroupFromInvite,
  createGroupInviteCode,
  revokedGroupInviteCode,
} from "../../../lib/supabase/groupInvites";
import { useSession } from "../../../contexts/SessionContext";
import { useGetProfile } from "../../../hooks/useGetProfile";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { handleSupabaseError } from "../../../lib/supabase/util";
import { MESSAGES } from "../../../constants/messages";

export default function ManageGroupScreen() {
  const { session, loading } = useSession();
  const userId = session?.user?.id;
  const { visible, message, showMessage, hideSnackbar } = useSnackbar();

  // プロフィール取得
  const { data: profile, isLoading, error } = useGetProfile(userId);
  const [inviteCode, setInviteCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  const handleGenerateCode = async () => {
    const code = await createGroupInviteCode(profile.current_group_id);
    setGeneratedCode(code);
  };

  const handleCopyCode = () => {
    if (generatedCode) {
      Clipboard.setStringAsync(generatedCode);
      alert("コピーしました: " + generatedCode);
    }
  };

  const handleAppliedGroup = async () => {
    try {
      const isAppied = await appliedGroupFromInvite(inviteCode);
      if (isAppied) {
        showMessage(MESSAGES.OK.completeAppliedGroup);
        setInviteCode("");
      }
    } catch (error) {
      handleSupabaseError(error, showMessage);
    }
  };

  const handleRevokeCode = async () => {
    await revokedGroupInviteCode(generatedCode);
    setGeneratedCode("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.inner}>
            {/* 招待する側 */}
            <View style={styles.section}>
              <Text style={styles.title}>🔑 あなたが招待する場合</Text>
              <TouchableOpacity onPress={handleCopyCode}>
                <View style={styles.codeBox}>
                  <Text style={styles.codeText}>
                    {generatedCode || "まだ作成されていません"}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  generatedCode ? styles.buttonDanger : styles.buttonPrimary,
                ]}
                onPress={generatedCode ? handleRevokeCode : handleGenerateCode}
              >
                <Text style={styles.buttonText}>
                  {generatedCode ? "招待コード無効化" : "招待コード作成"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 招待される側 */}
            <View style={styles.section}>
              <Text style={styles.title}>📩 あなたが招待される場合</Text>
              <Text style={styles.label}>招待コードを入力：</Text>
              <TextInput
                style={styles.input}
                placeholder="例: ABCD1234"
                value={inviteCode}
                onChangeText={setInviteCode}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleAppliedGroup}
              >
                <Text style={styles.buttonText}>グループに参加</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Snackbar
            visible={visible}
            onDismiss={hideSnackbar}
            duration={3000}
            action={{ label: "閉じる", onPress: hideSnackbar }}
          >
            {message}
          </Snackbar>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  section: {
    marginBottom: 32,
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 12,
  },
  codeBox: {
    backgroundColor: "#e0f3ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  codeText: {
    fontSize: 16,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    color: "#555",
  },
  button: {
    backgroundColor: "#007aff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonPrimary: {
    backgroundColor: "#007aff", // 青
  },
  buttonDanger: {
    backgroundColor: "#ff3b30", // 赤（iOS風）
  },
});
