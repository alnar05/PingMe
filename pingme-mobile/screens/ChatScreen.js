import React, { useEffect, useRef, useState } from 'react';
import { Button, FlatList, Text, TextInput, View } from 'react-native';
import { WS_URL } from '../config';

export default function ChatScreen({ route }) {
  const { chatId, chatName } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}?chatId=${chatId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('ws open');
    };
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        setMessages((m) => [...m, msg]);
      } catch (err) {
        console.warn('Invalid msg', e.data);
      }
    };
    ws.onerror = (err) => console.warn('ws error', err.message);
    ws.onclose = () => console.log('ws closed');

    return () => {
      ws.close();
    };
  }, [chatId]);

  const send = () => {
    if (!text) return;
    const payload = { chatId, text, sender: 'mobile-user', timestamp: Date.now() };
    wsRef.current?.send(JSON.stringify(payload));
    setText('');
    setMessages((m) => [...m, payload]); // optimistic
  };

  return (
    <View style={{ flex: 1, padding: 8 }}>
      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>{chatName}</Text>
      <FlatList
        style={{ flex: 1 }}
        data={messages}
        keyExtractor={(item, i) => (item.id ?? i).toString()}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 4 }}>
            <Text>{item.sender}: {item.text}</Text>
          </View>
        )}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput value={text} onChangeText={setText} style={{ flex: 1, borderWidth: 1, padding: 8 }} />
        <Button title="Send" onPress={send} />
      </View>
    </View>
  );
}