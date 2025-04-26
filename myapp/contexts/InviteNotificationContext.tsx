import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase/supabase";
import { fetchPendingInviteRequests } from "../lib/supabase/inviteCodesUses";
import { InviteCodeUses } from "../types/daoTypes";

type InviteNotificationContextType = {
  hasPendingInvites: boolean;
  inviteCodeUses: InviteCodeUses[];
};

export const InviteNotificationContext = createContext<
  InviteNotificationContextType | undefined
>(undefined);

export const InviteNotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [hasPendingInvites, setHasPendingInvites] = useState(false);
  const [inviteCodeUses, setInviteCodeUses] = useState<InviteCodeUses[]>([]);

  useEffect(() => {
    const fetchPendingInvites = async () => {
      const data = await fetchPendingInviteRequests();
      console.log(hasPendingInvites);

      setInviteCodeUses(data);
      setHasPendingInvites(data.length > 0);
    };

    fetchPendingInvites();

    const channel = supabase
      .channel("invite-code-uses-updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT, UPDATE",
          schema: "public",
          table: "invite_code_uses",
        },
        () => {
          fetchPendingInvites();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <InviteNotificationContext.Provider
      value={{ hasPendingInvites, inviteCodeUses }}
    >
      {children}
    </InviteNotificationContext.Provider>
  );
};
