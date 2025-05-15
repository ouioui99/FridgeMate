import { supabase } from "./supabase";
import * as SecureStore from "expo-secure-store";
import { v4 as uuidv4 } from "uuid";
import { USER_KEY } from "../../constants/settings";

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
};

export async function initializeUser() {
  let userId = await SecureStore.getItemAsync(USER_KEY);

  if (!userId) {
    // UUIDを生成してユーザー登録
    const newUUID = uuidv4();
    const { data, error } = await supabase.auth.signUp({
      email: `${newUUID}@example.com`, // ダミーのメールアドレス
      password: uuidv4(), // 適当なパスワード
    });

    if (error) {
      console.error("User registration failed", error);
      return;
    }

    // 登録したUUIDをローカルに保存
    await SecureStore.setItemAsync(USER_KEY, newUUID);

    console.log("Anonymous user created:", data.user?.id);
  } else {
    // UUIDがあるならセッション復元
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${userId}@example.com`,
      password: userId, // 簡易的にUUIDをパスワードに流用
    });

    if (error) {
      console.error("Anonymous login failed", error);
    } else {
      console.log("Anonymous user logged in:", data.user?.id);
    }
  }
}
