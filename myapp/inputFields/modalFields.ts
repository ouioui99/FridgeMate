import { Field } from "../types/formModalTypes";

export const stockFields: Field[] = [
  // {
  //   key: "image",
  //   label: "画像URL",
  //   placeholder: "画像URL (任意)",
  //   type: "image",
  // },
  {
    key: "image",
    label: "image",
    placeholder: "イメージを追加",
    type: "image",
  },
  { key: "name", label: "名前", placeholder: "商品名を入力" },
  {
    key: "amount",
    label: "個数",
    placeholder: "個数を入力",
    type: "number",
  },
  // {
  //   key: "expiration_date",
  //   label: "賞味期限",
  //   placeholder: "YYYY-MM-DD",
  //   type: "date",
  // },
];

export const shoppingListFields: Field[] = [
  { key: "name", label: "買い物アイテム", placeholder: "商品名を入力" },
  {
    key: "amount",
    label: "個数",
    placeholder: "個数を入力",
    type: "number",
  },
];
