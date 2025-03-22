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

export type stocks = Stock[];
