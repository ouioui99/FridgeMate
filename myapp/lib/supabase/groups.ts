import { Group } from "../../types/daoTypes";
import { supabase } from "./supabase";
import { getLoginUserId } from "./util";

export const getGroupsEqId = async (id: string): Promise<Group> => {
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
