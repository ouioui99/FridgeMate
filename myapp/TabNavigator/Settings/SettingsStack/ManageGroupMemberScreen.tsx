import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Share,
} from "react-native";
import { createGroupInviteCode } from "../../../lib/supabase/groupInvites";
import { getProfile } from "../../../lib/supabase/profiles";
import { getLoginUserId } from "../../../lib/supabase/util";
import { useSession } from "../../../contexts/SessionContext";

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

const ManageGroupMemberScreen = () => {
  const { session, loading } = useSession();
  const userId = session?.user?.id;
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
          //onRemoveMember(member.uid);
        },
      },
    ]);
  };

  // 招待リンクを作成して共有する関数
  const handleCreateAndShareInviteLink = async () => {
    try {
      const profile = await getProfile(); // ログイン中のユーザーの所属グループIDを取得
      const groupId = profile.current_group_id;

      if (!groupId) {
        Alert.alert("エラー", "現在所属しているグループが見つかりません");
        return;
      }

      // 招待リンクを作成
      const inviteCode = await createGroupInviteCode(groupId);

      // ネイティブの共有画面を開く
      await Share.share({
        message: `招待リンクをコピーしました！\n在庫を共有したい相手にシェアしよう！\n${inviteCode}`,
        url: inviteCode,
        title: "グループに招待",
      });
    } catch (error) {
      console.error("招待リンクの作成に失敗:", error);
      Alert.alert("エラー", "招待リンクの作成に失敗しました");
    }
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
    <View style={styles.container}>
      <FlatList
        data={group.members}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <View style={styles.memberRow}>
            <Text>{item.name}</Text>
            {isAdmin && item.uid !== userId && (
              <>
                <Pressable onPress={() => handleRemove(item)}>
                  <Text style={styles.removeText}>削除</Text>
                </Pressable>
              </>
            )}
          </View>
        )}
        ListHeaderComponent={<Text style={styles.title}>メンバー一覧</Text>}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      />
    </View>
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

export default ManageGroupMemberScreen;
