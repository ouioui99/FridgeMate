// components/InviteRequestPopup.tsx
import { useInviteRequest } from "../contexts/InviteRequestContext";
import { View, Text, Modal, Button } from "react-native";

export const InviteRequestPopup = () => {
  const { request, setRequest } = useInviteRequest();

  if (!request) return null;

  return (
    <Modal transparent visible animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}
        >
          <Text>招待コード申請が届いています</Text>
          <Text>ユーザーID: {request.userId}</Text>
          <View style={{ marginTop: 16, flexDirection: "row", gap: 10 }}>
            <Button title="承認" onPress={() => setRequest(null)} />
            <Button title="拒否" onPress={() => setRequest(null)} />
          </View>
        </View>
      </View>
    </Modal>
  );
};
