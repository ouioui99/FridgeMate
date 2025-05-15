import { supabase } from "./supabase";
import * as SecureStore from "expo-secure-store";
import { v4 as uuidv4 } from "uuid";
import { USER_KEY, USER_PASSWORD } from "../../constants/settings";

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
};

export async function initializeUser() {
  const userId = await SecureStore.getItemAsync(USER_KEY);
  const userPassword = await SecureStore.getItemAsync(USER_PASSWORD);

  if (!userId || !userPassword) {
    // UUIDを生成してユーザー登録
    const newUUID = uuidv4();
    const newPassword = uuidv4();

    const { data, error } = await supabase.auth.signUp({
      email: `${newUUID}@example.com`, // ダミーのメールアドレス
      password: newPassword, // 適当なパスワード
    });

    if (error) {
      console.error("User registration failed", error);
      return;
    }

    // 登録したUUIDをローカルに保存
    await SecureStore.setItemAsync(USER_KEY, newUUID);
    await SecureStore.setItemAsync(USER_PASSWORD, newPassword);

    console.log("Anonymous user created:", data.user?.id);
  } else {
    // UUIDがあるならセッション復元
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${userId}@example.com`,
      password: userPassword,
    });

    if (error) {
      console.error("Anonymous login failed", error);
    } else {
      console.log("Anonymous user logged in:", data.user?.id);
    }
  }
}
