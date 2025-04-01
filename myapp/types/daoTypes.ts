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
  owner_id: string;
  created_at: Date;
  updated_at: Date;
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
  group_id: string;
  inviter_id: string;
  invitee_email: string;
  invite_code: string;
  status: string;
  is_revoked: boolean;
  created_at: Date;
  expired_at: Date;
};

export type ShoppingList = {
  id: string;
  name: string;
  amount: number;
  checked: boolean;
  creater_id: string;
  group_id: string;
  created_at: Date;
  updated_at: Date;
};

export type ShoppingListInput = ShoppingList;
