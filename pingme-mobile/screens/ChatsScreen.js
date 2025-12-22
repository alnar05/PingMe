import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { API_URL } from '../config';

export default function ChatsScreen({ navigation, route }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/chats`); // implement on backend
        const data = await res.json();
        setChats(data);
      } catch (e) {
        console.warn('Failed to fetch chats', e);
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Chat', { chatId: item.id, chatName: item.name })}>
            <View style={{ padding: 16, borderBottomWidth: 1 }}>
              <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
              <Text numberOfLines={1}>{item.lastMessage}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}