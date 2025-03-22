import { supabase } from "./supabase";

export const getLoginUserId = async () => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    console.error("User not authenticated");
    throw new Error("ログインが必要です");
  }

  return userData.user.id;
};
