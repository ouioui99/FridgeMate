import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UserSettings = {
  autoAddToShoppingList: boolean;
  setAutoAddToShoppingList: (val: boolean) => void;
  isConfirmWhenAutoAddToShoppingList: boolean;
  setIsConfirmWhenAutoAddToShoppingList: (val: boolean) => void;
};

const STORAGE_KEY = "userSettings";

const UserSettingsContext = createContext<UserSettings | undefined>(undefined);

export const UserSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [autoAddToShoppingList, setAutoAddToShoppingListState] = useState(true);
  const [
    isConfirmWhenAutoAddToShoppingList,
    setIsConfirmWhenAutoAddToShoppingListState,
  ] = useState(false);

  // 保存関数（両方まとめて保存）
  const saveSettings = async (
    newSettings: Partial<{
      autoAddToShoppingList: boolean;
      isConfirmWhenAutoAddToShoppingList: boolean;
    }>
  ) => {
    try {
      const current = {
        autoAddToShoppingList,
        isConfirmWhenAutoAddToShoppingList,
        ...newSettings, // 上書き
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch (e) {
      console.error("Failed to save user settings", e);
    }
  };

  const setAutoAddToShoppingList = (val: boolean) => {
    setAutoAddToShoppingListState(val);
    saveSettings({ autoAddToShoppingList: val });
  };

  const setIsConfirmWhenAutoAddToShoppingList = (val: boolean) => {
    setIsConfirmWhenAutoAddToShoppingListState(val);
    saveSettings({ isConfirmWhenAutoAddToShoppingList: val });
  };

  // 初期化：保存された設定を読み込む
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed.autoAddToShoppingList === "boolean") {
            setAutoAddToShoppingListState(parsed.autoAddToShoppingList);
          }
          if (typeof parsed.isConfirmWhenAutoAddToShoppingList === "boolean") {
            setIsConfirmWhenAutoAddToShoppingListState(
              parsed.isConfirmWhenAutoAddToShoppingList
            );
          }
        }
      } catch (e) {
        console.error("Failed to load user settings", e);
      }
    };
    loadSettings();
  }, []);

  return (
    <UserSettingsContext.Provider
      value={{
        autoAddToShoppingList,
        setAutoAddToShoppingList,
        isConfirmWhenAutoAddToShoppingList,
        setIsConfirmWhenAutoAddToShoppingList,
      }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
};

export const useUserSettings = () => {
  const context = useContext(UserSettingsContext);
  if (!context) {
    throw new Error(
      "useUserSettings must be used within a UserSettingsProvider"
    );
  }
  return context;
};
