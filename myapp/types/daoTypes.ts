// 型定義
export type Stock = {
  id: string;
  name: string;
  amount: number;
  expirationDate: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  groupId: string;
  createrId: string;
};

export type Group = {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type GroupShare = {
  id: string;
  groupId: string;
  sharedWith: string;
  createdAt: string;
};

export type StockInput = Omit<Stock, "id" | "owner_id">;

export type stocks = Stock[];

export type GroupInvite = {
  id: string;
  groupId: string;
  inviterId: string;
  inviteeEmail: string;
  inviteCode: string;
  status: string;
  isRevoked: boolean;
  createdAt: Date;
  expiredAt: Date;
};
