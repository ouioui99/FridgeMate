import {
  Modal,
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Checkbox from "expo-checkbox";

type Applicant = {
  inviteCodeUsesId: string;
  inviteeUid: string;
  username: string;
  groupInvitesId: string;
  groupId: string;
};

type Props = {
  visible: boolean;
  applicants: Applicant[];
  onClose: () => void;
  onApprove: (selected: Applicant[]) => void;
  onReject: (selected: Applicant[]) => void;
};

const ApplicantModal = ({
  visible,
  applicants,
  onClose,
  onApprove,
  onReject,
}: Props) => {
  const [selectedApplicants, setSelectedApplicants] = useState<Applicant[]>([]);

  const toggleSelect = (applicant: Applicant) => {
    setSelectedApplicants((prev) =>
      prev.some((a) => a.inviteCodeUsesId === applicant.inviteCodeUsesId)
        ? prev.filter((a) => a.inviteCodeUsesId !== applicant.inviteCodeUsesId)
        : [...prev, applicant]
    );
  };

  const isSelected = (inviteCodeUsesId: string) => {
    return selectedApplicants.some(
      (a) => a.inviteCodeUsesId === inviteCodeUsesId
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modal}>
              {/* 閉じるボタン */}
              <Pressable style={styles.closeIcon} onPress={onClose}>
                <Text style={{ fontSize: 20 }}>✕</Text>
              </Pressable>

              <Text style={styles.title}>申請者一覧</Text>

              <FlatList
                data={applicants}
                keyExtractor={(item) => item.inviteCodeUsesId}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => toggleSelect(item)}
                    style={styles.row}
                  >
                    <Checkbox
                      value={isSelected(item.inviteCodeUsesId)}
                      onValueChange={() => toggleSelect(item)}
                    />
                    <Text style={styles.name}>{item.username}</Text>
                  </Pressable>
                )}
              />

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#F44336" }]}
                  onPress={() => onReject(selectedApplicants)}
                >
                  <Text style={styles.actionText}>拒否</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#4CAF50" }]}
                  onPress={() => onApprove(selectedApplicants)}
                >
                  <Text style={styles.actionText}>承認</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// styles は変更なし
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000066",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modal: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
    position: "relative",
  },
  closeIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 8,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
  },
  name: {
    fontSize: 16,
    marginLeft: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 24,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ApplicantModal;
