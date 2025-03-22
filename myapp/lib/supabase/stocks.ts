import { Stock, StockInput } from "../../types/daoTypes";
import { supabase } from "./supabase";
import { getLoginUserId } from "./util";

/**
 * 在庫を取得する関数
 * @returns {Promise<Stock[]>} 取得した在庫データ
 */
export const fetchStocks = async () => {
  const { data, error } = await supabase
    .from("stocks")
    .select("*")
    .order("created_at", { ascending: true }); // ここで順序を固定

  if (error) {
    console.error("Error fetching stocks:", error.message);
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
  const userId = await getLoginUserId();

  const { error } = await supabase.from("stocks").insert([
    {
      ...stock,
      amount: Number(stock.amount),
      owner_id: userId, // ユーザーIDを設定
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
  const userId = await getLoginUserId();

  const { error } = await supabase
    .from("stocks")
    .update({
      ...stock,
      owner_id: userId, // ユーザーIDを設定
    })
    .eq("id", stockId);

  if (error) {
    console.error("Error updating stock:", error.message);
    throw error;
  }
};
