import { MESSAGES } from "../../constants/messages";
import { GroupInvite, InviteeGroupMember } from "../../types/daoTypes";
import { joinGroupMembers } from "./groupMembers";
import { changeCurrentGroup } from "./profiles";
import { supabase } from "./supabase";
import { generateHashed8DigitNumber, getLoginUserId } from "./util";

/**
 * グループ招待リンクを作成する関数
 * @param {string} groupId 招待を作成するグループのID
 * @param {string | null} inviteeEmail 招待するユーザーのメールアドレス（指定しない場合は null）
 * @returns {Promise<string>} 招待URL（招待コード付き）
 */
export const createGroupInviteCode = async (
  groupId: string,
  inviteeEmail: string | null = null
): Promise<string> => {
  const inviterId = await getLoginUserId();
  const inviteCode = generateHashed8DigitNumber(); // UUIDで招待コードを生成

  const { error } = await supabase.from("group_invites").insert([
    {
      group_id: groupId,
      inviter_id: inviterId,
      invitee_email: inviteeEmail, // 指定されていない場合は NULL
      invite_code: inviteCode,
      status: "pending", // 初期状態
      expires_at: new Date(Date.now() + 10 * 60 * 6000).toISOString(), // 60分後
    },
  ]);

  if (error) {
    console.error("Error creating group invite:", error.message);
    throw error;
  }

  return inviteCode;
};

export const refusejoinGroupByInvite = async (
  inviteCode: string
): Promise<void> => {
  const userId = await getLoginUserId();

  // 招待コードが有効かチェック
  const { data: invite, error } = await supabase
    .from("group_invites")
    .select("id, group_id, status, is_revoked")
    .eq("invite_code", inviteCode)
    .single();

  if (error || !invite || invite.status !== "pending" || invite.is_revoked) {
    throw new Error("Invalid or expired invite code.");
  }

  // 招待の状態を `accepted` に更新
  await supabase
    .from("group_invites")
    .update({ is_revoked: true })
    .eq("id", invite.id);
};

export const getGroupInvite = async (
  inviteCode: string
): Promise<GroupInvite> => {
  const { data: invite, error } = await supabase
    .from("group_invites")
    .select("id, group_id, inviter_id, invitee_email ,invite_code ,status")
    .eq("invite_code", inviteCode)
    .single<GroupInvite>();

  if (error) {
    throw new Error("Invalid or expired invite code.");
  }
  return invite;
};

export const revokedGroupInviteCode = async (inviteCode: string) => {
  const invite = await getGroupInvite(inviteCode);

  const { error: updateError } = await supabase
    .from("group_invites")
    .update({ status: "revoked" })
    .eq("id", invite.id);

  if (updateError) {
    throw new Error("招待コードの無効化に失敗しました");
  }
};

export const appliedGroupFromInvite = async (
  inviteCode: string
): Promise<boolean> => {
  const userId = await getLoginUserId();

  const { data: invite, error } = await supabase
    .from("group_invites")
    .select("id, group_id, inviter_id, status, is_revoked, expires_at")
    .eq("invite_code", inviteCode)
    .single();

  if (error || !invite || invite.status !== "pending" || invite.is_revoked) {
    throw new Error("無効または期限切れの招待コードです。");
  }

  // すでにこのユーザーが使ったか確認
  const { count } = await supabase
    .from("invite_code_uses")
    .select("*", { count: "exact", head: true })
    .eq("invite_code_id", invite.id)
    .eq("invitee_id", userId);

  if (count && count > 0) {
    throw new Error("このコードはすでに使用済みです。");
  }

  // 使用記録を保存
  const { error: insertError } = await supabase
    .from("invite_code_uses")
    .insert([
      {
        invite_code_id: invite.id,
        invitee_id: userId,
        status: "applied",
        used_at: new Date().toISOString(),
      },
    ]);

  if (insertError) {
    throw insertError;
  }

  // グループ参加処理（joinGroupMembersなど）
  // await joinGroupMembers(...);

  return true;
};

export const getInviteeGroupMember = async (
  inviterId: string
): Promise<InviteeGroupMember[]> => {
  const { data: invite, error } = await supabase
    .from("group_invites")
    .select(
      `
      id,
      group_id,
      inviter_id,
      invitee_email,
      invite_code,
      status,
      invitee_id,
      group_invites_invitee_id_fkey (
        id,
        username
      )
    `
    )
    .eq("inviter_id", inviterId);
  if (error) {
    throw new Error("Invalid or expired invite code.");
  }

  return invite;
};
