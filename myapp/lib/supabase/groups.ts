import { Group } from "../../types/daoTypes";
import { supabase } from "./supabase";

export const getGroupsEqId = async (id: string): Promise<Group> => {
  const { data, error, status } = await supabase
    .from("groups")
    .select(`id, name, owner_id, created_at, updated_at`)
    .eq("id", id)
    .single();
  if (error && status !== 406) {
    throw error;
  }

  if (data === null) {
    throw "data is null";
  }

  return data;
};

export const getOwnerGroup = async (userId: string): Promise<Group> => {
  const { data, error, status } = await supabase
    .from("groups")
    .select(`id, name, owner_id, created_at, updated_at`)
    .eq("owner_id", userId)
    .single();
  if (error && status !== 406) {
    throw error;
  }
  if (data === null) {
    throw "data is null";
  }

  return data;
};
