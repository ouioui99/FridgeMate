import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { createGroupInvite } from "../../../lib/supabase/groupInvites";

type Member = {
  uid: string;
  name: string;
  status:
    | "pending"
    | "applied"
    | "accepted"
    | "rejected"
    | "expired"
    | "revoked";
  // メンバーの招待ステータスを追加
};

type Group = {
  id: string;
  name: string;
  members: Member[];
  adminUid: string;
};

type Props = {
  userUid: string;
  group: Group;
  onRemoveMember: (memberUid: string) => void;
};

const ManageGroupScreen: React.FC<Props> = ({ userUid, onRemoveMember }) => {
  const [email, setEmail] = useState("");

  const group = {
    id: "1",
    name: "家族",
    adminUid: "u1",
    members: [
      { uid: "u1", name: "自分", status: "accepted" },
      { uid: "u2", name: "お母さん", status: "applied" },
    ],
  };

  const isAdmin = true;

  const handleRemove = (member: Member) => {
    Alert.alert("メンバー削除", `${member.name} をグループから削除しますか？`, [
      { text: "キャンセル", style: "cancel" },
      {
        text: "削除",
        style: "destructive",
        onPress: () => {
          onRemoveMember(member.uid);
        },
      },
    ]);
  };

  const handleInvite = async () => {
    if (!email) {
      Alert.alert("エラー", "メールアドレスを入力してください");
      return;
    }

    // 招待リンク作成処理
    const groupInviteCode = await createGroupInvite(group.id, email);
    setEmail(""); // 入力欄クリア
    Alert.alert("招待リンク作成", "招待リンクが作成されました");
  };

  const handleApprove = (member: Member) => {
    Alert.alert("承認", `${member.name} を承認しますか？`, [
      { text: "キャンセル", style: "cancel" },
      {
        text: "承認",
        style: "default",
        onPress: () => {
          // 承認処理をここに追加
          Alert.alert(`${member.name} が承認されました`);
        },
      },
    ]);
  };

  const handleReject = (member: Member) => {
    Alert.alert("拒否", `${member.name} を拒否しますか？`, [
      { text: "キャンセル", style: "cancel" },
      {
        text: "拒否",
        style: "destructive",
        onPress: () => {
          // 拒否処理をここに追加
          Alert.alert(`${member.name} が拒否されました`);
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
    >
      <View style={styles.container}>
        <FlatList
          data={group.members}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <View style={styles.memberRow}>
              <Text>{item.name}</Text>
              {isAdmin && item.uid !== userUid && (
                <>
                  {item.status === "applied" ? (
                    <View style={styles.buttonGroup}>
                      <Pressable onPress={() => handleApprove(item)}>
                        <Text style={styles.approveText}>承認</Text>
                      </Pressable>
                      <Pressable onPress={() => handleReject(item)}>
                        <Text style={styles.rejectText}>拒否</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable onPress={() => handleRemove(item)}>
                      <Text style={styles.removeText}>削除</Text>
                    </Pressable>
                  )}
                </>
              )}
            </View>
          )}
          ListHeaderComponent={<Text style={styles.title}>メンバー一覧</Text>}
          contentContainerStyle={{ paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
        />

        {isAdmin && (
          <View style={styles.inviteBar}>
            <Pressable style={styles.inviteButton} onPress={handleInvite}>
              <Text style={styles.inviteButtonText}>招待リンク作成</Text>
            </Pressable>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
  },
  memberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  removeText: {
    color: "red",
  },
  approveText: {
    color: "green",
    marginRight: 10,
  },
  rejectText: {
    color: "red",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 10,
  },
  inviteBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  inviteButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    width: "100%", // 横幅を画面いっぱいに
  },
  inviteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ManageGroupScreen;
