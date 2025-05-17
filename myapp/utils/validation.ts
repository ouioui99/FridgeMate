import { name } from "./../node_modules/expo-checkbox/src/ExpoCheckbox.web";
import { ShoppingListInput } from "../types/daoTypes";

export const vaildateShoppingListInput = (data: Partial<ShoppingListInput>) => {
  const errors: Partial<Record<keyof ShoppingListInput, string>> = {};
  if (!data.name || data.name.trim() === "") {
    errors.name = "名前は必須です";
  }

  if (data.amount === undefined) {
    errors.amount = "名前は必須です";
  }
  return Object.keys(errors).length > 0 ? errors : null;
};
