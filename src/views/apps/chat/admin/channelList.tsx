// src\views\apps\chat\channelList.tsx
import React from 'react';
import { List, ListItem, ListItemText, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ChannelType } from 'src/types/apps/chatType';

interface ChannelListProps {
  channels: ChannelType[];
  onEdit: (channel: ChannelType) => void;
  onDelete: (id: number) => void;
}

const ChannelList: React.FC<ChannelListProps> = ({ channels, onEdit, onDelete }) => {
  return (
    <List>
      {channels.map((channel) => (
        <ListItem key={channel.id} divider>
          <ListItemText
            primary={channel.fullName}
            secondary={
              <>
                <Typography component="span" variant="body2">
                  {channel.about}
                </Typography>
                <br />
                <Typography component="span" variant="caption" color="textSecondary">
                  Status: {channel.status}
                </Typography>
              </>
            }
          />
          <IconButton onClick={() => onEdit(channel)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => onDelete(channel.id)}>
            <DeleteIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
};

export default ChannelList;
