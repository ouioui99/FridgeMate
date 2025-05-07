// components/InviteRealtimeSubscriber.tsx
import { useEffect } from "react";
import { supabase } from "./supabase";
import { useInviteRequest } from "../../contexts/InviteRequestContext";
import { getLoginUserId } from "./util";

export const InviteRealtimeSubscriber = () => {
  const { setRequest } = useInviteRequest();

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel>;

    const subscribe = async () => {
      const userId = await getLoginUserId();

      channel = supabase
        .channel("invite-code-uses")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "invite_code_uses",
          },
          (payload) => {
            const data = payload.new;
            if (data.status === "applied" && data.inviter_id === userId) {
              setRequest({
                inviteCode: data.invite_code,
                userId: data.user_id,
              });
            }
          }
        )
        .subscribe();
    };

    subscribe();

    return () => {
      channel?.unsubscribe();
    };
  }, []);

  return null;
};
