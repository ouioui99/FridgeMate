import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

type Profile = {
  username: string;
  website: string;
  avatar_url: string;
};

async function saveProfile(userId: string, profile: Profile) {
  if (!userId) throw new Error("User ID is required");

  const updates = {
    id: userId,
    ...profile,
    updated_at: new Date(),
  };

  const { error } = await supabase.from("profiles").upsert(updates);
  if (error) throw error;
}

export function useUpdateProfile(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profile: Profile) => saveProfile(userId!, profile),
    onSuccess: () => {
      queryClient.invalidateQueries(["profile", userId]); // キャッシュを更新
    },
  });
}
