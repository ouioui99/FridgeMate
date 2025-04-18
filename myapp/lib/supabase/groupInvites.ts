import { MESSAGES } from "../../constants/messages";
import { GroupInvite } from "../../types/daoTypes";
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
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7日後
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
  const invite = await getGroupInvite(inviteCode);
  const userId = await getLoginUserId();

  console.log(invite);
  console.log(invite.inviter_id);
  console.log(userId);

  if (invite.inviter_id === userId) {
    throw new Error(MESSAGES.NG.hostIdSameAsLoginId);
  }

  const { error: updateError } = await supabase
    .from("group_invites")
    .update({ status: "applied" })
    .eq("id", invite.id);

  if (updateError) {
    throw new Error("招待コードの無効化に失敗しました");
  }
  return true;
};
