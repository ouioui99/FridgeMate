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
