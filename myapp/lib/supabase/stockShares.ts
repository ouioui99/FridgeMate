import { supabase } from "./supabase";

export const sendInvite = async (inviteeEmail: string) => {
  const { data, error } = await supabase.from("invites").insert([
    {
      group_id: stockId,
      inviter_id: (await supabase.auth.getUser()).data?.user?.id,
      invitee_email: inviteeEmail,
      status: "pending",
    },
  ]);

  if (error) {
    console.error("Invite error:", error.message);
  }
};

export const acceptInvite = async (inviteId: string) => {
  const { data, error } = await supabase
    .from("stock_invites")
    .update({ status: "accepted" })
    .eq("id", inviteId)
    .select();

  if (error) {
    console.error("Accept error:", error.message);
    return;
  }

  // `stock_shares` に追加して共有確定
  const stockId = data[0].stock_id;
  const userId = (await supabase.auth.getUser()).data?.user?.id;

  await supabase.from("stock_shares").insert([
    {
      stock_id: stockId,
      shared_with: userId,
    },
  ]);
};
