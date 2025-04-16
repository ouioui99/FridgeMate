import { GroupInvite } from "../../types/daoTypes";
import { supabase } from "./supabase";
import { getLoginUserId } from "./util";

export const getProfile = async () => {
  const loginUserId = await getLoginUserId();
  const { data, error, status } = await supabase
    .from("profiles")
    .select(`full_name, username, website, avatar_url, current_group_id`)
    .eq("id", loginUserId)
    .single();
  //   if (error && status !== 406) {
  //     throw error;
  //   }
  return data;
};

export const changeCurrentGroup = async (
  userId: string,
  invite: GroupInvite
) => {
  const { error: changeError } = await supabase
    .from("profiles")
    .update([{ current_group_id: invite.group_id }])
    .eq("id", userId);

  if (joinError) {
    console.error("Error joining group:", joinError.message);
    throw joinError;
  }
};
