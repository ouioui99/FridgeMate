import { useEffect } from "react";
import { supabase } from "./lib/supabase/supabase";
import { AppState } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { SessionProvider } from "./contexts/SessionContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserSettingsProvider } from "./contexts/UserSettingsContext";
import { InviteRequestPopup } from "./components/InviteRequestPopup";
import { InviteRequestProvider } from "./contexts/InviteRequestContext";
import { InviteRealtimeSubscriber } from "./lib/supabase/InviteRealtimeSubscriber";
import { AppNavigator } from "./AppNavigator";

export default function App() {
  const queryClient = new QueryClient();
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <SessionProvider>
          <UserSettingsProvider>
            <InviteRequestProvider>
              <InviteRealtimeSubscriber />
              <InviteRequestPopup />
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
            </InviteRequestProvider>
          </UserSettingsProvider>
        </SessionProvider>
      </SafeAreaView>
    </QueryClientProvider>
  );
}
