import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  Pressable,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

type Member = {
  uid: string;
  name: string;
};

type Group = {
  id: string;
  name: string;
  members: Member[];
  adminUid: string;
};

type Props = {
  userUid: string;
  groups: Group[];
  onRemoveMember: (groupId: string, memberUid: string) => void;
};

export const ManageGroupScreen: React.FC<Props> = ({
  userUid,
  onRemoveMember,
}) => {
  const groups = [
    {
      id: "1",
      name: "家族",
      adminUid: "u1",
      members: [
        { uid: "u1", name: "お父さん" },
        { uid: "u2", name: "お母さん" },
      ],
    },
    {
      id: "2",
      name: "友達",
      adminUid: "u3",
      members: [
        { uid: "u1", name: "自分" },
        { uid: "u3", name: "友達A" },
      ],
    },
  ];

  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id || "");

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);
  const isAdmin = selectedGroup?.adminUid === userUid;

  const handleRemove = (member: Member) => {
    Alert.alert("メンバー削除", `${member.name} をグループから削除しますか？`, [
      { text: "キャンセル", style: "cancel" },
      {
        text: "削除",
        style: "destructive",
        onPress: () => {
          if (selectedGroup) {
            onRemoveMember(selectedGroup.id, member.uid);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>グループを選択:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedGroupId}
          onValueChange={(itemValue) => setSelectedGroupId(itemValue)}
          style={styles.picker}
        >
          {groups.map((group) => (
            <Picker.Item key={group.id} label={group.name} value={group.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.subtitle}>メンバー一覧</Text>
      {selectedGroup ? (
        <FlatList
          data={selectedGroup.members}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <View style={styles.memberRow}>
              <Text>{item.name}</Text>
              {isAdmin && item.uid !== userUid && (
                <Pressable onPress={() => handleRemove(item)}>
                  <Text style={styles.removeText}>削除</Text>
                </Pressable>
              )}
            </View>
          )}
        />
      ) : (
        <Text>グループが見つかりません。</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "#ccc",
    marginVertical: 8,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
  },
  memberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  removeText: {
    color: "red",
  },
});
