// src\views\apps\chat\channelMessages.tsx
import React, { useState, useEffect } from 'react';
import { Button, TextField, List, ListItem, ListItemText, Typography } from '@mui/material';
import useChat from 'src/hooks/useChat';
import { ChatType, ChannelType } from 'src/types/apps/chatType';

interface ChannelMessagesProps {
  channel: ChannelType;
  onBack: () => void;
}

const ChannelMessages: React.FC<ChannelMessagesProps> = ({ channel, onBack }) => {
  const { chatData, fetchChatData, sendMessage } = useChat();
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchChatData(channel.id);
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
