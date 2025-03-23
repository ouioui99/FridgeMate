import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase/supabase";
import { getProfile } from "../lib/supabase/profiles";

async function fetchProfile(userId: string) {
  if (!userId) throw new Error("User ID is required");

  const data = getProfile();
  return data;
}

export function useGetProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfile(userId!),
    enabled: !!userId, // userId があるときのみ実行
    staleTime: 1000 * 60 * 5, // 5分間キャッシュを保持
  });
}
