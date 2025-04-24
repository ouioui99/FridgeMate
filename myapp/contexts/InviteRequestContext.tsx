// contexts/InviteRequestContext.tsx
import React, { createContext, useContext, useState } from "react";

type InviteRequest = {
  inviteCode: string;
  userId: string;
};

type ContextType = {
  request: InviteRequest | null;
  setRequest: (req: InviteRequest | null) => void;
};

const InviteRequestContext = createContext<ContextType>({
  request: null,
  setRequest: () => {},
});

export const InviteRequestProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [request, setRequest] = useState<InviteRequest | null>(null);

  return (
    <InviteRequestContext.Provider value={{ request, setRequest }}>
      {children}
    </InviteRequestContext.Provider>
  );
};

export const useInviteRequest = () => useContext(InviteRequestContext);
