import { GroupInvite } from "../../types/daoTypes";
import { supabase } from "./supabase";
import { getLoginUserId } from "./util";
import { v4 as uuidv4 } from "uuid";

/**
 * グループ招待リンクを作成する関数
 * @param {string} groupId 招待を作成するグループのID
 * @param {string | null} inviteeEmail 招待するユーザーのメールアドレス（指定しない場合は null）
 * @returns {Promise<string>} 招待URL（招待コード付き）
 */
export const createGroupInvite = async (
  groupId: string,
  inviteeEmail: string | null = null
): Promise<string> => {
  const inviterId = await getLoginUserId();
  const inviteCode = uuidv4(); // UUIDで招待コードを生成

  const { error } = await supabase.from("group_invites").insert([
    {
      group_id: groupId,
      inviter_id: inviterId,
      invitee_email: inviteeEmail, // 指定されていない場合は NULL
      invite_code: inviteCode,
      status: "pending", // 初期状態
      is_revoked: false, // 招待は有効
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7日後
    },
  ]);

  if (error) {
    console.error("Error creating group invite:", error.message);
    throw error;
  }

  return `${process.env.EXPO_PUBLIC_APP_URL}/invite/${inviteCode}`; // 招待URLを返す
};

export const joinGroupByInvite = async (inviteCode: string): Promise<void> => {
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

  // グループに参加
  const { error: joinError } = await supabase
    .from("group_shares")
    .insert([{ group_id: invite.group_id, shared_with: userId }]);

  if (joinError) {
    console.error("Error joining group:", joinError.message);
    throw joinError;
  }

  // current_Groupを変更
  const { error: changeError } = await supabase
    .from("profiles")
    .update([{ current_group_id: invite.group_id }])
    .eq("id", userId);

  if (joinError) {
    console.error("Error joining group:", joinError.message);
    throw joinError;
  }

  // 招待の状態を `accepted` に更新
  await supabase
    .from("group_invites")
    .update({ status: "accepted" })
    .eq("id", invite.id);
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
  inviteeEmail: string
): Promise<GroupInvite | null> => {
  const { data: invite, error } = await supabase
    .from("group_invites")
    .select("id, group_id, invite_code ,status, is_revoked")
    .eq("invitee_email", inviteeEmail)
    .single<GroupInvite>();

  //データが一つもない場合
  if ((error && error.code === "PGRST116") || invite.status === "accepted") {
    return null;
  }

  if (error) {
    throw new Error("Invalid or expired invite code.");
  }

  return invite;
};
