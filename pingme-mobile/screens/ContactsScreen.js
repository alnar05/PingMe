import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { ENDPOINTS } from "../config";

export default function ContactsScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // TODO: replace with real logged-in user later
  const CURRENT_USER_ID = "user-1";

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch(ENDPOINTS.USERS);
      const data = await res.json();
      setUsers(data.filter(u => u.id !== CURRENT_USER_ID));
    } catch (e) {
      console.warn("Failed to load users", e);
    } finally {
      setLoading(false);
    }
  };

  const openChat = async (receiverId) => {
    try {
      const res = await fetch(
        `${ENDPOINTS.CHATS}?sender-id=${CURRENT_USER_ID}&receiver-id=${receiverId}`,
        { method: "POST" }
      );
      const data = await res.json();

      navigation.navigate("Chat", {
        chatId: data.response,
        chatName: "Chat",
      });
    } catch (e) {
      console.warn("Failed to create chat", e);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userRow}
            onPress={() => openChat(item.id)}
          >
            <View>
              <Text style={styles.name}>
                {item.firstName} {item.lastName}
              </Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
            <Text style={styles.status}>
              {item.online ? "● online" : "offline"}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  userRow: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: { fontSize: 16, fontWeight: "600" },
  email: { color: "#666" },
  status: { fontSize: 12 },
});
