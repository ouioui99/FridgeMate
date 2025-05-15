import { Group, GroupShare, Profile, StockInput } from "./../../types/daoTypes";
import { getProfile } from "./profiles";
import { supabase } from "./supabase";
import { getLoginUserId } from "./util";

/**
 * 在庫を取得する関数
 * @returns {Promise<Stock[]>} 取得した在庫データ
 */
export const fetchStocks = async (currentGroupId: string) => {
  // グループIDを使ってストックを取得
  const { data, error } = await supabase
    .from("stocks")
    .select("*")
    .eq("group_id", currentGroupId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("ストックの取得中にエラーが発生しました:", error.message);
    throw error;
  }

  return data;
};

/**
 * 在庫を取得する関数
 * @param {string} currentGroupId - 現在のグループID
 * @param {string[]} nameList - 取得したいストックの名前リスト
 * @returns {Promise<Stock[]>} 取得した在庫データ
 */
export const fetchSomeStocks = async (
  currentGroupId: string,
  nameList: string[]
) => {
  // グループIDとnameListに一致するストックを取得
  const { data, error } = await supabase
    .from("stocks")
    .select("*")
    .eq("group_id", currentGroupId)
    .in("name", nameList);

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
export const addStock = async (
  stock: StockInput,
  currentGroupId: string
): Promise<void> => {
  const loginUserId = await getLoginUserId();

  const { error } = await supabase.from("stocks").insert([
    {
      ...stock,
      amount: Number(stock.amount),
      creater_id: loginUserId,
      group_id: currentGroupId, // ユーザーIDを設定
    },
  ]);

  if (error) {
    console.error("Error adding stock:", error.message);
    throw error;
  }
};

/**
 * 在庫を複数追加する関数
 * @param {StockInput[]} stocks 在庫データ
 * @returns {Promise<void>}
 */
export const addStocks = async (
  stockInputList: StockInput[],
  profile: Profile
): Promise<void> => {
  const loginUserId = await getLoginUserId();

  const rows = stockInputList.map((stockInput) => ({
    ...stockInput,
    creater_id: loginUserId,
    group_id: profile.current_group_id, // ユーザーIDを設定
  }));

  const { error } = await supabase.from("stocks").insert(rows);

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

/**
 * 在庫を削除する関数
 * @param {string} stockId 削除する在庫のID
 * @returns {Promise<void>}
 */
export const deleteStock = async (stockId: string): Promise<void> => {
  const { error } = await supabase.from("stocks").delete().eq("id", stockId);

  if (error) {
    console.error("Error deleting stock:", error.message);
    throw error;
  }
};
