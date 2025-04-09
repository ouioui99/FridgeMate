import { Group, GroupInvite, stocks } from "../../types/daoTypes";
import { getGroupInvite } from "./groupInvites";
import { getGroupsEqId } from "./groups";
import { fetchStocks } from "./stocks";
import { supabase } from "./supabase";

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

    if (invite) {
      const groupData = await getGroupsEqId(invite.group_id);
      setInvitedGroupData(groupData);
      setInviteData(invite);
      showInviteAlert(groupData, invite);
    }
  } catch (error) {
    console.error(error);
  }
};
