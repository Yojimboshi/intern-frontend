import React from 'react';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AnnouncementList = ({ announcements, onEdit, onDelete }) => {
  return (
    <List>
      {announcements.map((announcement) => (
        <ListItem key={announcement.id} divider>
          <ListItemText primary={announcement.title} secondary={announcement.content} />
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
