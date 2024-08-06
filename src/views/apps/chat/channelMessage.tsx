// src\views\apps\chat\channelMessages.tsx
import React, { useState, useEffect } from 'react';
import { Button, TextField, List, ListItem, ListItemText, Typography } from '@mui/material';
import useChat from 'src/hooks/useChat';
import { ChatType, ChannelType } from 'src/types/apps/chatType';
import { RootState, AppDispatch } from 'src/store'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserProfile, fetchChatsContacts } from 'src/store/apps/chat'

interface ChannelMessagesProps {
  channel: ChannelType;
  onBack: () => void;
}

const ChannelMessages: React.FC<ChannelMessagesProps> = ({ channel, onBack }) => {
  const { chatData, fetchChatData, sendMessage } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.chat)
  const chats = useSelector((state: RootState) => state.chat.chats);
  const contacts = useSelector((state: RootState) => state.chat.contacts);

  useEffect(() => {
    console.log('Chats in store:', chats);
    console.log('Contacts in store:', contacts);
  }, [chats, store]);

  useEffect(() => {
    fetchChatData(channel.id);
    dispatch(fetchUserProfile());
    dispatch(fetchChatsContacts()).then(() => {
      console.log('data stored in store:', store); // Ensure this log is in the right place
    });
  }, [fetchChatData, channel.id]);


  const handleSendMessage = async () => {
    await sendMessage(channel.id, newMessage);
    setNewMessage('');
    fetchChatData(channel.id);
  };

  return (
    <div>
      <Button onClick={onBack} variant="contained" color="secondary">
        Back to Channels
      </Button>
      <Typography variant="h5">{channel.name}</Typography>
      <List>
        {chatData.map((message: ChatType) => (
          <ListItem key={message.id} divider>
            <ListItemText primary={message.message} secondary={new Date(message.created_at).toLocaleString()} />
          </ListItem>
        ))}
      </List>
      <TextField
        label="New Message"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        fullWidth
      />
      <Button onClick={handleSendMessage} variant="contained" color="primary">
        Send
      </Button>
    </div>
  );
};

export default ChannelMessages;
