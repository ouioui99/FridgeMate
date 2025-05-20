import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  Pressable,
  TouchableOpacity,
} from "react-native";
import {
  acceptApplied,
  rejectApplied,
  removeMember,
} from "../../../lib/supabase/util";
import { useSession } from "../../../contexts/SessionContext";
import { GroupMember, SeclectedInviteCodeUses } from "../../../types/daoTypes";
import ApplicantModal from "../../../components/ApplicantModal";
import { useInviteNotification } from "../../../hooks/useInviteNotification";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getGroupMembers } from "../../../lib/supabase/groupMembers";
import { useGetProfile } from "../../../hooks/useGetProfile";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { Snackbar } from "react-native-paper";
import { CommonStyles } from "../../../styles/CommonStyles";
import { MESSAGES } from "../../../constants/messages";

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
  const { inviteCodeUses } = useInviteNotification();
  const navigation = useNavigation();
  const [showApplicantModal, setShowApplicantModal] = useState(false);
  const userId = session?.user?.id;
  // プロフィール取得
  const { data: profile, isLoading, error } = useGetProfile(userId);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);

  const { visible, message, showMessage, hideSnackbar } = useSnackbar();

  const isAdmin =
    groupMembers.find((member) => member.memberProfileData.id === userId)
      ?.admin ?? false;

  const fetchGroupMembers = async () => {
    if (profile) {
      const groupMembers = await getGroupMembers(profile.current_group_id);

      setGroupMembers(groupMembers);
    }
  };

  useEffect(() => {
    setShowApplicantModal(0 < inviteCodeUses.length);
  }, [inviteCodeUses]);

  useEffect(() => {
    if (showApplicantModal) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={() => setShowApplicantModal(true)}
            style={styles.addButton}
          >
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={28}
              color="red"
            />
          </TouchableOpacity>
        ),
      });
    } else {
      navigation.setOptions({
        headerRight: () => <></>,
      });
    }
  }, [navigation, showApplicantModal]);

  useEffect(() => {
    fetchGroupMembers();
  }, [profile]);

  const handleRemove = async (member: GroupMember) => {
    // member.memberProfileData.username とか使える
    Alert.alert(
      "メンバー削除",
      `${member.memberProfileData.username} をグループから削除しますか？`,
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除",
          style: "destructive",
          onPress: async () => {
            await removeMember(member);
            fetchGroupMembers();
            showMessage(MESSAGES.OK.completeDeleteGroupMember);
          },
        },
      ]
    );
  };

  const handleAccept = async (
    selectedInviteCodeUsesList: SeclectedInviteCodeUses[]
  ) => {
    await acceptApplied(selectedInviteCodeUsesList);
    fetchGroupMembers();
    showMessage(MESSAGES.OK.completeAddGroupMember);
  };

  const handleReject = async (
    selectedInviteCodeUsesList: SeclectedInviteCodeUses[]
  ) => {
    const inviteCodeUseIdList = selectedInviteCodeUsesList.map(
      (selectedInviteCodeUse) => selectedInviteCodeUse.inviteCodeUsesId
    );

    // 選択されたユーザー名のリストを作成
    const selectedUsers = selectedInviteCodeUsesList
      .map((item) => item.username)
      .join("\n");

    Alert.alert(
      "申請を拒否",
      `以下のユーザーの申請を拒否しますか？\n${selectedUsers}`,
      [
        {
          text: "キャンセル",
          style: "cancel",
        },
        {
          text: "拒否",
          style: "destructive",
          onPress: () => {
            rejectApplied(inviteCodeUseIdList);
            setShowApplicantModal(false);
            showMessage(MESSAGES.OK.completeDenyAppliedGroup);
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* 加入済みメンバー */}
        <FlatList
          data={groupMembers
            .slice()
            .sort((a, b) => (a.admin === b.admin ? 0 : a.admin ? -1 : 1))}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.memberRow}>
              <Text style={styles.memberText}>
                {item.memberProfileData.id === userId
                  ? "自分"
                  : item.memberProfileData.username}
              </Text>
              {isAdmin && item.memberProfileData.id !== userId && (
                <Pressable
                  style={styles.actionButtonRemove}
                  onPress={() => handleRemove(item)}
                >
                  <Text style={styles.actionButtonText}>削除</Text>
                </Pressable>
              )}
            </View>
          )}
        />

        <ApplicantModal
          visible={showApplicantModal}
          applicants={inviteCodeUses.map((inviteCodeUse) => ({
            inviteCodeUsesId: inviteCodeUse.id,
            inviteeUid: inviteCodeUse.invitee_Profile.id,
            username: inviteCodeUse.invitee_Profile.username,
            groupInvitesId: inviteCodeUse.group_invites.id,
            groupId: inviteCodeUse.group_invites.group_id,
          }))}
          onClose={() => setShowApplicantModal(false)}
          onAccept={(selected) => {
            handleAccept(selected);
          }}
          onReject={(selectedInviteCodeUse) => {
            handleReject(selectedInviteCodeUse);
          }}
        />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  joinedContainer: {
    height: "100%", // 高さを画面の半分に
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 12,
  },
  memberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  memberText: {
    fontSize: 18,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 10,
  },
  actionButtonAccept: {
    backgroundColor: "#4CAF50", // 緑
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  actionButtonReject: {
    backgroundColor: "#F44336", // 赤
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  actionButtonRemove: {
    backgroundColor: "#F44336", // 赤
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    marginRight: 15,
  },
});

export default ManageGroupMemberScreen;
