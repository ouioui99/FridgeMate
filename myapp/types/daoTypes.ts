// 型定義
export type Stock = {
  id: string;
  name: string;
  amount: number;
  expiration_date: string;
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

export type GroupMember = {
  id: string;
  group_id: string;
  memberProfileData: Profile;
  created_at: Date;
  updated_at: Date;
  admin: boolean;
};

export type Profile = {
  id: string;
  username: string;
  avatar_url: string;
  current_group_id: string;
};

export type InviteeGroupMember = {
  id: string;
  group_id: string;
  inviter_id: string;
  invitee_email: string;
  invite_code: string;
  status: string;
  is_revoked: boolean;
  created_at: Date;
  expired_at: Date;
  group_invites_invitee_id_fkey: Profile;
};

export type InviteCodeUses = {
  id: string;
  invitee_Profile: Profile;
  status: string;
  used_at: Date;
  invite_code_id: string;
  group_invites: GroupInvite;
};

export type SeclectedInviteCodeUses = {
  inviteCodeUsesId: string;
  inviteeUid: string;
  username: string;
  groupInvitesId: string;
  groupId: string;
};
