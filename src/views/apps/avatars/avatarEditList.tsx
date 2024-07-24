import React from 'react';
import { List, ListItem, ListItemText, Avatar as MuiAvatar, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AvatarEditList = ({ avatars, onEdit, onDelete }) => {
  if (!avatars || avatars.length === 0) {
    return <Typography variant="body2" color="textSecondary">No avatars found</Typography>;
  }

  return (
    <List>
      {avatars.map((avatar) => (
        <ListItem key={avatar.id} divider>
          <MuiAvatar
            src={`data:image/jpeg;base64,${avatar.image}`}
            alt={`Avatar ${avatar.id}`}
            sx={{ width: 70, height: 70, marginRight: 2 }}
          />
          <ListItemText
            primary={
              <Typography variant="body1" sx={{ fontSize: '1.5rem' }}>
                {`Avatar ${avatar.id}`}
              </Typography>
            }
            secondary={
              <Typography component="span" variant="body2" sx={{ fontSize: '1.2rem', color: 'textSecondary' }}>
                Level: {avatar.level}
              </Typography>
            }
          />
          <IconButton onClick={() => onEdit(avatar)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => onDelete(avatar.id)}>
            <DeleteIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
};

export default AvatarEditList;
