import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase/supabase";
import { getLoginUserId } from "../lib/supabase/util";
import { fetchPendingInviteRequests } from "../lib/supabase/inviteCodesUses";

export const useInviteNotification = () => {
  const [hasPendingInvites, setHasPendingInvites] = useState(false);
  const [appliedInvites, setAppliedInvites] = useState([]);

  useEffect(() => {
    const fetchPendingInvites = async () => {
      const data = await fetchPendingInviteRequests();
      setAppliedInvites(data);

      if (data.length > 0) {
        setHasPendingInvites(true);
      } else {
        setHasPendingInvites(false);
      }
    };

    fetchPendingInvites();

    const channel = supabase
      .channel("invite-code-uses-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "invite_code_uses" },
        () => {
          fetchPendingInvites();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { hasPendingInvites, appliedInvites };
};
