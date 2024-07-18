import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const AnnouncementList = ({ announcements }) => {
  return (
    <List>
      {announcements.map((announcement) => (
        <ListItem key={announcement.id} divider>
          <ListItemText primary={announcement.title} secondary={announcement.content} />
        </ListItem>
      ))}
    </List>
  );
};

export default AnnouncementList;
