import { useContext } from "react";
import { InviteNotificationContext } from "../contexts/InviteNotificationContext";

export const useInviteNotification = () => {
  const context = useContext(InviteNotificationContext);
  if (!context) {
    throw new Error(
      "useInviteNotification must be used within an InviteNotificationProvider"
    );
  }
  return context;
};
