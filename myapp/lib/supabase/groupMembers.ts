import { GroupInvite, GroupMember } from "../../types/daoTypes";
import { supabase } from "./supabase";

export const getGroupsEqId = async (id: string): Promise<GroupMember> => {
  const { data, error, status } = await supabase
    .from("groups")
    .select(`id, name, owner_id, created_at, updated_at`)
    .eq("id", id)
    .single();
  if (error && status !== 406) {
    throw error;
  }

  return data;
};

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
