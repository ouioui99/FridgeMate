import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile } from "../lib/supabase/profiles";
import { supabase } from "../lib/supabase/supabase";

async function fetchProfile(userId: string) {
  if (!userId) throw new Error("User ID is required");
  return await getProfile(); // userIdは内部で getLoginUserId() を使っている
}

export function useGetProfile(userId: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfile(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5分キャッシュ
  });

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`profile-updates-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles", // ✅ テーブル名は "profiles"
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          const { old: oldData, new: newData } = payload;

          if (
            "current_group_id" in newData &&
            newData.current_group_id !== oldData.current_group_id
          ) {
            queryClient.refetchQueries({ queryKey: ["profile", userId] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  return query;
}
