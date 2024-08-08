// src\views\apps\chat\channelList.tsx
import React from 'react';
import { List, ListItem, ListItemText, IconButton, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ChannelType } from 'src/types/apps/chatType';

interface ChannelListProps {
  channels: ChannelType[];
  onEdit: (channel: ChannelType) => void;
  onDelete: (id: number) => void;
  onViewMessages: (channelId: number) => void;
}

const ChannelList: React.FC<ChannelListProps> = ({ channels, onEdit, onDelete, onViewMessages }) => {
  return (
    <List>
      {channels.map((channel) => (
        <ListItem key={channel.id} divider>
          <ListItemText primary={channel.fullName} secondary={channel.about} />
          <IconButton onClick={() => onEdit(channel)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => onDelete(channel.id)}>
            <DeleteIcon />
          </IconButton>
          <Button onClick={() => onViewMessages(channel.id)} variant="contained" color="primary">
            View Messages
          </Button>
        </ListItem>
      ))}
    </List>
  );
};

export default ChannelList;
