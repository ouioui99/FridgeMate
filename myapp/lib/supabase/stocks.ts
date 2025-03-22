import { Group, GroupShare, StockInput } from "./../../types/daoTypes";
import { getProfile } from "./profiles";
import { supabase } from "./supabase";
import { getLoginUserId } from "./util";

/**
 * 在庫を取得する関数
 * @returns {Promise<Stock[]>} 取得した在庫データ
 */
export const fetchStocks = async () => {
  const loginUserId = await getLoginUserId();

  // ユーザーがアクセスできるグループIDを取得
  const { data: groups, error: groupsError } = await supabase
    .from("groups")
    .select("id")
    .eq("owner_id", loginUserId);

  if (groupsError) {
    console.error(
      "グループの取得中にエラーが発生しました:",
      groupsError.message
    );
    throw groupsError;
  }

  // ユーザーが共有しているグループIDを取得
  const { data: sharedGroups, error: sharedGroupsError } = await supabase
    .from("group_shares")
    .select("group_id")
    .eq("shared_with", loginUserId);

  if (sharedGroupsError) {
    console.error(
      "共有グループの取得中にエラーが発生しました:",
      sharedGroupsError.message
    );
    throw sharedGroupsError;
  }

  // グループIDをフラットな配列に変換
  const groupIds = [
    ...groups.map((group: Group) => group.id),
    ...sharedGroups.map((share: GroupShare) => share.groupId),
  ];

  // グループIDを使ってストックを取得
  const { data, error } = await supabase
    .from("stocks")
    .select("*")
    .in("group_id", groupIds) // フラットな配列を渡す
    .order("created_at", { ascending: true });

  if (error) {
    console.error("ストックの取得中にエラーが発生しました:", error.message);
    throw error;
  }

  return data;
};

/**
 * 在庫を追加する関数
 * @param {StockInput} stock 在庫データ
 * @returns {Promise<void>}
 */
export const addStock = async (stock: StockInput): Promise<void> => {
  const profile = await getProfile();
  const loginUserId = await getLoginUserId();

  const { error } = await supabase.from("stocks").insert([
    {
      ...stock,
      amount: Number(stock.amount),
      creater_id: loginUserId,
      group_id: profile.current_group_id, // ユーザーIDを設定
    },
  ]);

  if (error) {
    console.error("Error adding stock:", error.message);
    throw error;
  }
};

/**
 * 在庫を更新する関数
 * @param {string} stockId 更新する在庫のID
 * @param {StockInput} stock 更新する在庫データ
 * @returns {Promise<void>}
 */
export const updateStock = async (
  stockId: string,
  stock: Partial<StockInput>
): Promise<void> => {
  const { error } = await supabase
    .from("stocks")
    .update(stock)
    .eq("id", stockId);

  if (error) {
    console.error("Error updating stock:", error.message);
    throw error;
  }
};
