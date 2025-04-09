import { Field } from "../types/formModalTypes";

export const stockFields: Field[] = [
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
  {
    key: "image",
    label: "画像URL",
    placeholder: "画像URL (任意)",
    type: "image",
  },
];

export const shoppingListFields: Field[] = [
  { key: "name", label: "名前", placeholder: "商品名を入力" },
  {
    key: "amount",
    label: "個数",
    placeholder: "個数を入力",
    type: "number",
  },
];
