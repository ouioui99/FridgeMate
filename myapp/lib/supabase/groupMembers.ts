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
