import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase/supabase";
import { fetchPendingInviteRequests } from "../lib/supabase/inviteCodesUses";
import { InviteCodeUses } from "../types/daoTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { USER_KEY } from "../constants/settings";

type InviteNotificationContextType = {
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
  const [inviteCodeUses, setInviteCodeUses] = useState<InviteCodeUses[]>([]);

  useEffect(() => {
    const fetchPendingInvites = async () => {
      const isLaunched = await AsyncStorage.getItem("hasLaunched");
      if (!isLaunched) return;
      const data: any = await fetchPendingInviteRequests();
      setInviteCodeUses(data);
    };

    fetchPendingInvites();

    const channel = supabase
      .channel("invite-code-uses-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
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
    <InviteNotificationContext.Provider value={{ inviteCodeUses }}>
      {children}
    </InviteNotificationContext.Provider>
  );
};
