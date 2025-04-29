import { GroupInvite, GroupMember } from "../../types/daoTypes";
import { supabase } from "./supabase";

export const joinGroupMembers = async (
  userId: string,
  group_id: string
): Promise<void> => {
  const { error: joinError } = await supabase
    .from("group_members")
    .insert([{ group_id: group_id, member_uid: userId }]);

  if (joinError) {
    console.error("Error joining group:", joinError.message);
    throw joinError;
  }
};

export const getGroupMembers = async (
  group_id: string
): Promise<GroupMember[]> => {
  const { data: groupMemberData, error: joinError } = await supabase
    .from("group_members")
    .select(
      `
      id,
      group_id,
      memberProfileData:profiles!member_uid ( id,username ),
      created_at,
      updated_at,
      admin
    `
    )
    .eq("group_id", group_id);

  if (joinError) {
    console.error("Error joining group:", joinError.message);
    throw joinError;
  }
  return groupMemberData;
};
