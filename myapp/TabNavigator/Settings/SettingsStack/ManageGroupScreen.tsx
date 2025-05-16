import React, { useEffect, useState } from "react";
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
  Share,
} from "react-native";
import { Snackbar } from "react-native-paper";
import {
  appliedGroupFromInvite,
  createGroupInviteCode,
  getValidGroupInvite,
  revokedGroupInviteCode,
} from "../../../lib/supabase/groupInvites";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSession } from "../../../contexts/SessionContext";
import { useGetProfile } from "../../../hooks/useGetProfile";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { handleSupabaseError } from "../../../lib/supabase/util";
import { MESSAGES } from "../../../constants/messages";
import { getGroupsEqId } from "../../../lib/supabase/groups";
import { CommonStyles } from "../../../styles/CommonStyles";
import { changeUsername, getProfile } from "../../../lib/supabase/profiles";

export default function ManageGroupScreen() {
  const { session, loading } = useSession();
  const userId = session?.user?.id;
  const { visible, message, showMessage, hideSnackbar } = useSnackbar();

  // プロフィール取得
  const { data: profile, isLoading, error } = useGetProfile(userId);
  const [inviteCode, setInviteCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGroupAdmin, setIsGroupAdmin] = useState(false);
  const [displayName, setDisplayName] = useState("");

  const handleChangeDisplayName = async () => {
    if (!userId) return;
    await changeUsername(userId, displayName);
    showMessage(MESSAGES.OK.completeChangeDisplayName);
  };

  const handleGenerateCode = async () => {
    if (!profile) return;
    const code = await createGroupInviteCode(profile.current_group_id);
    setGeneratedCode(code);
  };

  const handleShareCode = async () => {
    if (!generatedCode) return;

    try {
      await Share.share({
        message: `招待コード: ${generatedCode}\nこのコードを招待したい人にシェアしよう！`,
        title: "招待コードを共有", // Android で表示されるタイトル
      });
    } catch (error) {
      console.error("共有に失敗しました", error);
      alert("共有に失敗しました");
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

  useEffect(() => {
    const getValidGroupInvitesData = async () => {
      const validGroupInviteData = await getValidGroupInvite();

      if (validGroupInviteData) {
        setGeneratedCode(validGroupInviteData.invite_code);
      }
    };
    const isAdminCheck = async () => {
      if (profile) {
        const currentGroupData = await getGroupsEqId(profile.current_group_id);
        setIsGroupAdmin(currentGroupData.owner_id === userId);
      }
    };

    const initDisplayname = async () => {
      const profileData = await getProfile();
      if (!profileData) return;
      setDisplayName(profileData.username);
    };
    getValidGroupInvitesData();
    isAdminCheck();
    initDisplayname();
  }, [profile]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={100} // 入力欄を被らないように余白を確保
      >
        <View style={styles.inner}>
          <View style={styles.section}>
            <Text style={styles.title}>グループ内で表示する自分の表示名</Text>
            <TextInput
              style={styles.input}
              placeholder="例: 母"
              value={displayName}
              onChangeText={setDisplayName}
            />
            <TouchableOpacity
              style={[CommonStyles.completeButton]}
              onPress={handleChangeDisplayName}
            >
              <Text style={CommonStyles.buttonText}>表示名変更</Text>
            </TouchableOpacity>
          </View>
          {/* 招待する側 */}
          {isGroupAdmin && (
            <View style={styles.section}>
              <Text style={styles.title}>🔑 あなたが招待する場合</Text>
              <TouchableOpacity onPress={handleShareCode}>
                <View style={styles.codeBox}>
                  <Text style={styles.codeText}>
                    {generatedCode || "まだ作成されていません"}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  CommonStyles.completeButton,
                  generatedCode && styles.buttonDanger,
                ]}
                onPress={generatedCode ? handleRevokeCode : handleGenerateCode}
              >
                <Text style={CommonStyles.buttonText}>
                  {generatedCode ? "招待コード無効化" : "招待コード作成"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 招待される側 */}
          <View style={styles.section}>
            <Text style={styles.title}>📩 あなたが招待される場合</Text>
            <Text style={styles.label}>招待コードを入力：</Text>
            <TextInput
              style={[
                styles.input,
                generatedCode && CommonStyles.inputDisabled, // 無効時にスタイルを追加（任意）
              ]}
              placeholder="例: 123456789"
              value={inviteCode}
              onChangeText={setInviteCode}
              editable={!generatedCode}
            />

            <TouchableOpacity
              style={[
                CommonStyles.completeButton,
                generatedCode || !inviteCode ? CommonStyles.buttonDisabled : "", // 無効時にスタイルを追加（任意）
              ]}
              onPress={handleAppliedGroup}
              disabled={!!generatedCode || !inviteCode}
            >
              <Text style={CommonStyles.buttonText}>グループに参加</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Snackbar
          visible={visible}
          onDismiss={hideSnackbar}
          duration={3000}
          action={{ label: "閉じる", onPress: hideSnackbar }}
          style={CommonStyles.bottomSnackbar}
        >
          {message}
        </Snackbar>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
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
  buttonPrimary: {
    backgroundColor: "#007aff", // 青
  },
  buttonDanger: {
    backgroundColor: "#ff3b30", // 赤（iOS風）
  },
});
