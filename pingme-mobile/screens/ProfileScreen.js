import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { ENDPOINTS } from "../config";

export default function ProfileScreen() {
  const [user, setUser] = useState(null);

  // TODO: replace with auth-based user id
  const CURRENT_USER_ID = "user-1";

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await fetch(ENDPOINTS.USERS);
      const users = await res.json();
      const me = users.find(u => u.id === CURRENT_USER_ID);
      setUser(me);
    } catch (e) {
      console.warn("Failed to load profile", e);
    }
  };

  if (!user) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>
        {user.firstName} {user.lastName}
      </Text>

      <Text style={styles.label}>Email</Text>
      <Text style={styles.value}>{user.email}</Text>

      <Text style={styles.label}>Status</Text>
      <Text style={styles.value}>
        {user.online ? "Online" : "Offline"}
      </Text>

      <Text style={styles.label}>Last seen</Text>
      <Text style={styles.value}>
        {user.lastSeen ?? "Unknown"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    color: "#666",
    marginTop: 16,
  },
  value: {
    fontSize: 16,
  },
});
