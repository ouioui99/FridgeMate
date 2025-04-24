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
      status,
      used_at,
      invite_code_id,
      group_invites (
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
