import { InviteCodeUses } from "./../../types/daoTypes";
// lib/supabase/inviteNotifications.ts
import { supabase } from "./supabase";
import { getLoginUserId } from "./util";

export const fetchPendingInviteRequests = async () => {
  const userId = await getLoginUserId();
  const { data, error } = await supabase
    .from("invite_code_uses")
    .select(
      `
      id,
      invitee_id,
      invitee_Profile:profiles!invitee_id ( id,username ),
      status,
      used_at,
      invite_code_id,
      group_invites (
        id,
        group_id,
        inviter_id,
        invite_code
      )
    `
    )
    .eq("inviter_id", userId)
    .eq("status", "applied");
  if (error) {
    console.error("Failed to fetch pending invites:", error.message);
    return [];
  }

  return data;
};

export const rejectAppliedRequests = async (inviteCodeUsesIdList: string[]) => {
  console.log(inviteCodeUsesIdList);

  const { data, error } = await supabase
    .from("invite_code_uses")
    .update({ status: "rejected" })
    .in("id", inviteCodeUsesIdList); // 配列で指定

  if (error) {
    console.error("Failed to reject invites:", {
      message: error.message,
      details: error.details,
      code: error.code,
    });
    throw error; // エラーをスローして呼び出し元で処理できるように
  }

  return data;
};

export const acceptAppliedRequests = async (inviteCodeUsesIdList: string[]) => {
  const { data, error } = await supabase
    .from("invite_code_uses")
    .update({ status: "accepted" })
    .in("id", inviteCodeUsesIdList); // 配列で指定

  if (error) {
    console.error("Failed to reject invites:", {
      message: error.message,
      details: error.details,
      code: error.code,
    });
    throw error; // エラーをスローして呼び出し元で処理できるように
  }

  return data;
};

export const deleteInviteCodeUsesByGroupIdAndInviteeId = async (
  groupId: string,
  inviteeId: string
) => {
  // ①リレーションをたどって対象データを取得
  const { data, error: selectError } = await supabase
    .from("invite_code_uses")
    .select(
      `
      id,
      invite_code_id,
      group_invites (
        id,
        group_id
      )
    `
    )
    .eq("invitee_id", inviteeId)
    .eq("group_invites.group_id", groupId);

  if (selectError) {
    console.error("Failed to find invite_code_uses to delete:", selectError);
    throw selectError;
  }

  if (!data || data.length === 0) {
    console.log("No invite_code_uses found to delete.");
    return;
  }

  // ②取得できたデータから削除対象IDを取り出す
  const idsToDelete = data.map((d) => d.id);

  // ③まとめて削除
  const { error: deleteError } = await supabase
    .from("invite_code_uses")
    .delete()
    .in("id", idsToDelete);

  if (deleteError) {
    console.error("Failed to delete invite_code_uses:", deleteError);
    throw deleteError;
  }
};
