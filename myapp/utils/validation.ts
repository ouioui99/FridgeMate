import { ShoppingListInput, StockInput } from "../types/daoTypes";

const regexp = new RegExp(/^([1-9]\d*|0)$/);

export const validateShoppingListInput = (data: Partial<ShoppingListInput>) => {
  const errors: Partial<Record<keyof ShoppingListInput, string>> = {};
  const name = data.name;
  const amount = data.amount;

  if (!name || name.trim() === "") {
    errors.name = "名前は必須です";
  } else if (10 < name.length) {
    errors.name = "名前は10文字まで入力可能です";
  }

  if (!amount) {
    errors.amount = "個数は必須です";
  } else if (amount) {
    if (!regexp.test(String(amount))) {
      errors.amount = "個数は0以上の整数で入力してください";
    }
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateStockInput = (data: Partial<StockInput>) => {
  const errors: Partial<Record<keyof ShoppingListInput, string>> = {};
  const name = data.name;
  const amount = data.amount;

  if (!name || name.trim() === "") {
    errors.name = "名前は必須です";
  } else if (10 < name.length) {
    errors.name = "名前は10文字まで入力可能です";
  }

  if (!amount) {
    errors.amount = "個数は必須です";
  } else if (amount) {
    if (!regexp.test(String(amount))) {
      errors.amount = "個数は0以上の整数で入力してください";
    }
  }

  return Object.keys(errors).length > 0 ? errors : null;
};
