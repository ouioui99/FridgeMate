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
  SectionList,
  TouchableOpacity,
} from "react-native";
import {
  createGroupInviteCode,
  getInviteeGroupMember,
} from "../../../lib/supabase/groupInvites";
import { getProfile } from "../../../lib/supabase/profiles";
import { getLoginUserId, rejectApplied } from "../../../lib/supabase/util";
import { useSession } from "../../../contexts/SessionContext";
import { InviteeGroupMember, Profile } from "../../../types/daoTypes";
import ApplicantModal from "../../../components/ApplicantModal";
import { useInviteNotification } from "../../../hooks/useInviteNotification";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

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

  useEffect(() => {
    setShowApplicantModal(0 < inviteCodeUses.length);
  }, [inviteCodeUses]);

  useEffect(() => {
    showApplicantModal &&
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
  }, [navigation, showApplicantModal]);

  const userId = session?.user?.id;
  const group = {
    id: "1",
    name: "家族",
    adminUid: "u1",
    members: [
      { uid: "u1", name: "自分", status: "accepted" },
      { uid: "u2", name: "お母さん", status: "applied" },
      { uid: "u3", name: "お父さん", status: "pending" },
      { uid: "u4", name: "弟", status: "rejected" },
      { uid: "u5", name: "姉", status: "accepted" },
      { uid: "u6", name: "叔父さん", status: "revoked" },
    ],
  };

  const joinedMembers = group.members.filter((m) => m.status === "accepted");
  const invitedMembers = group.members.filter(
    (m) => m.status === "pending" || m.status === "applied"
  );

  const isAdmin = true;

  const handleRemove = async (memberProfile: Profile) => {
    await getInviteeGroupMember(userId);
    // Alert.alert("メンバー削除", `${member.name} をグループから削除しますか？`, [
    //   { text: "キャンセル", style: "cancel" },
    //   {
    //     text: "削除",
    //     style: "destructive",
    //     onPress: () => {
    //       //onRemoveMember(member.uid);
    //     },
    //   },
    // ]);
  };

  return (
    <View style={styles.container}>
      {/* 加入済みメンバー */}
      <View style={styles.joinedContainer}>
        <FlatList
          data={joinedMembers}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <View style={styles.memberRow}>
              <Text style={styles.memberText}>{item.name}</Text>
              {isAdmin && item.uid !== userId && (
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
      </View>

      <ApplicantModal
        visible={showApplicantModal}
        applicants={inviteCodeUses.map((inviteCodeUse) => ({
          inviteCodeUsesId: inviteCodeUse.id,
          inviteeUid: inviteCodeUse.invitee_Profile.id,
          username: inviteCodeUse.invitee_Profile.username,
          groupInvitesId: inviteCodeUse.group_invites.id,
          groupId: inviteCodeUse.invite_code_id,
        }))}
        onClose={() => setShowApplicantModal(false)}
        onApprove={(selected) => {
          console.log("承認する:", selected);
          // supabaseでstatus更新処理など
        }}
        onReject={(selectedInviteCodeUse) => {
          const inviteCodeUseIdList = selectedInviteCodeUse.map(
            (selectedInviteCodeUse) => selectedInviteCodeUse.inviteCodeUsesId
          );

          rejectApplied(inviteCodeUseIdList, setInviteCodeUses);
        }}
      />
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
  actionButtonApprove: {
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
