import { supabase } from "./supabase";

/**
 * 在庫を取得する関数
 * @returns {Promise<Stock[]>} 取得した在庫データ
 */
export const fetchStocks = async () => {
  const { data, error } = await supabase.from("stocks").select("*");

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
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    console.error("User not authenticated");
    throw new Error("ログインが必要です");
  }

  const userId = userData.user.id;

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

// 型定義
export type Stock = {
  id: string;
  name: string;
  amount: number;
  expiration_date: string;
  image?: string;
  owner_id: string;
};

export type StockInput = Omit<Stock, "id" | "owner_id">;
