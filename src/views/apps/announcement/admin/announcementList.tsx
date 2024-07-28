// src\views\apps\announcement\admin\announcementList.tsx
import React from 'react';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { NotificationsType } from 'src/types/apps/announcementTypes';

interface AnnouncementListProps {
  announcements: NotificationsType[];
  onEdit: (announcement: NotificationsType) => void;
  onDelete: (id: number) => void;
}

const AnnouncementList: React.FC<AnnouncementListProps> = ({ announcements, onEdit, onDelete }) => {
  return (
    <List>
      {announcements.map((announcement) => (
        <ListItem key={announcement.id} divider>
          <ListItemText primary={announcement.title} secondary={announcement.meta} /> {/* Assuming 'meta' corresponds to 'content' */}
          <IconButton onClick={() => onEdit(announcement)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => onDelete(announcement.id)}>
            <DeleteIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
};

export default AnnouncementList;
