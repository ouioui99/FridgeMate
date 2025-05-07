import {
  StockReplenishmentSetting,
  StockWithReplenishmentSetting,
} from "../../types/daoTypes";
import { supabase } from "./supabase";

export const upsertReplenishmentSetting = async (
  groupId: string,
  stockId: string,
  replenishmentAmount: number
): Promise<{ error: Error | null }> => {
  const { error } = await supabase.from("stock_replenishment_settings").upsert(
    [
      {
        group_id: groupId,
        stock_id: stockId,
        replenishment_amount: replenishmentAmount,
      },
    ],
    { onConflict: "group_id,stock_id" } // ここで一意制約に対応
  );

  return { error };
};

export const fetchReplenishmentSettingsByGroup = async (
  groupId: string
): Promise<StockWithReplenishmentSetting[]> => {
  const { data, error } = await supabase
    .from("stock_replenishment_settings")
    .select(
      `
      id,
      group_id,
      stock_id,
      replenishment_amount,
      created_at,
      updated_at,
      stock:stocks (
        id,
        name,
        amount,
        expiration_date,
        image,
        created_at,
        updated_at,
        group_id,
        creater_id
      )
    `
    )
    .eq("group_id", groupId);

  if (error) throw error;

  return data.map((item: any) => ({
    id: item.id,
    group_id: item.group_id,
    stock_id: item.stock_id,
    replenishment_amount: item.replenishment_amount,
    created_at: item.created_at,
    updated_at: item.updated_at,
    stock: {
      id: item.stock.id,
      name: item.stock.name,
      amount: item.stock.amount,
      expiration_date: item.stock.expiration_date,
      image: item.stock.image,
      createdAt: new Date(item.stock.created_at),
      updatedAt: new Date(item.stock.updated_at),
      groupId: item.stock.group_id,
      createrId: item.stock.creater_id,
    },
  }));
};
