import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { API_URL } from '../config';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');

  const login = async () => {
    // simple mock; replace with Keycloak/OAuth in next step
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      if (res.ok) {
        navigation.replace('Chats', { user: username });
      } else {
        alert('Login failed (backend)');
      }
    } catch (e) {
      alert('Network error: ' + e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PingMe — login</Text>
      <TextInput style={styles.input} placeholder="username" value={username} onChangeText={setUsername} />
      <Button title="Login" onPress={login} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  input: { borderWidth: 1, padding: 8, marginVertical: 12 },
  title: { fontSize: 22, marginBottom: 8 }
});