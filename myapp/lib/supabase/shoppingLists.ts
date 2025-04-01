import { ShoppingList, ShoppingListInput } from "./../../types/daoTypes";
import { supabase } from "./supabase";
import { getLoginUserId } from "./util";
import { getProfile } from "./profiles";

export const getShoppingLists = async (
  currentGroupId: string
): Promise<ShoppingList[]> => {
  // グループIDを使って買い物リストを取得
  const { data, error } = await supabase
    .from("shopping_lists")
    .select("*")
    .eq("group_id", currentGroupId)
    .order("checked", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("買い物リストの取得中にエラーが発生しました:", error.message);
    throw error;
  }

  return data;
};

/**
 * 在庫を追加する関数
 * @param {StockInput} stock 在庫データ
 * @returns {Promise<void>}
 */
export const addShoppingList = async (
  shoppingList: ShoppingListInput
): Promise<void> => {
  const profile = await getProfile();
  const loginUserId = await getLoginUserId();

  const { error } = await supabase.from("shopping_lists").insert([
    {
      ...shoppingList,
      amount: Number(shoppingList.amount),
      creater_id: loginUserId,
      group_id: profile.current_group_id, // ユーザーIDを設定
    },
  ]);

  if (error) {
    console.error("Error adding shoppingList:", error.message);
    throw error;
  }
};

/**
 * 買い物リストの更新関数
 * @param {string} id - 更新するアイテムのID
 * @param {Partial<ShoppingList>} updates - 更新するフィールド（checked, name, amountなど）
 * @returns {Promise<void>}
 */
export const updateShoppingList = async (
  id: string,
  updates: Partial<ShoppingList>
): Promise<void> => {
  // 更新データにupdated_atを追加
  const updateData = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("shopping_lists")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("買い物リストの更新中にエラーが発生しました:", error.message);
    throw error;
  }
};
