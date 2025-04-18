import { Group, GroupInvite, stocks } from "../../types/daoTypes";
import { SupabaseError } from "@supabase/supabase-js";
import { getGroupInvite } from "./groupInvites";
import { getGroupsEqId } from "./groups";
import { fetchStocks } from "./stocks";
import { supabase } from "./supabase";
import { v4 as uuidv4 } from "uuid";

export const getLoginUserId = async () => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    console.error("User not authenticated");
    throw new Error("ログインが必要です");
  }

  return userData.user.id;
};

export const fetchItems = async <T>(
  setStocks: (value: React.SetStateAction<T>) => void,
  current_group_id: string,
  fetchItemMethod: (currentGroupId: string) => Promise<T>
) => {
  try {
    const data = await fetchItemMethod(current_group_id);
    setStocks(data);
  } catch (error) {
    console.error(error);
  }
};

export const checkGroupInvite = async (
  setInvitedGroupData: (value: React.SetStateAction<Group | null>) => void,
  setInviteData: (value: React.SetStateAction<GroupInvite | null>) => void,
  showInviteAlert: (invitedGroup: Group, invite: GroupInvite) => void
) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const invite = await getGroupInvite(userData.user.email);

    if (
      (invite && !invite?.is_revoked) ||
      (invite && invite?.status !== "pending")
    ) {
      const groupData = await getGroupsEqId(invite.group_id);
      setInvitedGroupData(groupData);
      setInviteData(invite);
      showInviteAlert(groupData, invite);
    }
  } catch (error) {
    console.error(error);
  }
};

export const generateHashed8DigitNumber = () => {
  const uuid = uuidv4(); // 例: "de305d54-75b4-431b-adb2-eb6b9e546014"
  let hash = 0;
  for (let i = 0; i < uuid.length; i++) {
    hash = (hash << 5) - hash + uuid.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  const num = Math.abs(hash % 1e8); // 8桁に収める
  return num.toString().padStart(8, "0");
};

export const handleSupabaseError = (
  error: SupabaseError | null,
  showMessage: (msg: string) => void
) => {
  if (!error) return;

  console.error("Supabase error:", error);

  // カスタマイズ可
  if (error.code === "23505") {
    showMessage("すでに存在するデータです");
  } else if (error.message.includes("Auth")) {
    showMessage("認証エラーです。再度ログインしてください");
  } else {
    showMessage(error.message || "エラーが発生しました");
  }
};
