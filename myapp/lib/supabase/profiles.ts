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
