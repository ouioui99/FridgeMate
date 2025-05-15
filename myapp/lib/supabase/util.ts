import {
  GroupMember,
  InviteCodeUses,
  SeclectedInviteCodeUses,
} from "./../../types/daoTypes";
import { Group, GroupInvite, stocks } from "../../types/daoTypes";
import { SupabaseError } from "@supabase/supabase-js";
import { getGroupInvite } from "./groupInvites";
import { getGroupsEqId, getOwnerGroup } from "./groups";
import { fetchStocks } from "./stocks";
import { supabase } from "./supabase";
import { v4 as uuidv4 } from "uuid";
import {
  acceptAppliedRequests,
  deleteInviteCodeUsesByGroupIdAndInviteeId,
  fetchPendingInviteRequests,
  rejectAppliedRequests,
} from "./inviteCodesUses";
import { changeCurrentGroup } from "./profiles";
import { deleteGroupMember, joinGroupMembers } from "./groupMembers";

export const getLoginUserId = async () => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    console.error("User not authenticated");
    throw new Error("ログインが必要です");
  }

  return userData.user.id;
};

export const fetchItems = async <T>(
  setStocks: (value: React.SetStateAction<T>) => void,
  current_group_id: string,
  fetchItemMethod: (currentGroupId: string) => Promise<T>
) => {
  try {
    const data = await fetchItemMethod(current_group_id);

    setStocks(data);
  } catch (error) {
    console.error(error);
  }
};

export const generateHashed8DigitNumber = () => {
  const uuid = uuidv4();
  let hash = 0;
  for (let i = 0; i < uuid.length; i++) {
    hash = (hash << 5) - hash + uuid.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  const num = Math.abs(hash % 1e8); // 8桁に収める
  return num.toString().padStart(8, "0");
};

export const handleSupabaseError = (
  error: SupabaseError | null,
  showMessage: (msg: string) => void
) => {
  if (!error) return;

  console.error("Supabase error:", error);

  // カスタマイズ可
  if (error.code === "23505") {
    showMessage("すでに存在するデータです");
  } else if (error.message.includes("Auth")) {
    showMessage("認証エラーです。再度ログインしてください");
  } else {
    showMessage(error.message || "エラーが発生しました");
  }
};

export const rejectApplied = async (inviteCodeUseIdList: string[]) => {
  await rejectAppliedRequests(inviteCodeUseIdList);
  fetchPendingInviteRequests();
};

export const acceptApplied = async (
  selectedInviteCodeUsesList: SeclectedInviteCodeUses[]
) => {
  acceptAppliedRequests(
    selectedInviteCodeUsesList.map(
      (selectedInviteCodeUses) => selectedInviteCodeUses.inviteCodeUsesId
    )
  );
  for (let i = 0; i < selectedInviteCodeUsesList.length; i++) {
    const selectedInviteCodeUses = selectedInviteCodeUsesList[i];
    await joinGroupMembers(
      selectedInviteCodeUses.inviteeUid,
      selectedInviteCodeUses.groupId
    );
    await changeCurrentGroup(
      selectedInviteCodeUses.inviteeUid,
      selectedInviteCodeUses.groupId
    );
  }
};

export const removeMember = async (groupMember: GroupMember) => {
  const targetUid = groupMember.memberProfileData.id;
  //自身がadminのgroupを取得する
  const ownerGroup = await getOwnerGroup(targetUid);
  //profileのcurrentGroupIdを元々自動作成していたものに戻す
  await changeCurrentGroup(targetUid, ownerGroup.id);
  //groupMembersから消す
  await deleteGroupMember(groupMember.group_id, targetUid);
  //inviteCodeUsesから消す
  await deleteInviteCodeUsesByGroupIdAndInviteeId(
    groupMember.group_id,
    targetUid
  );
};
