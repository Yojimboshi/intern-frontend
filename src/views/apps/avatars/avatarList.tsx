import React from 'react';
import { List, ListItem, ListItemText, Avatar as MuiAvatar, Typography } from '@mui/material';

const AvatarList = ({ avatars }) => {
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
            sx={{ width: 200, height: 200, marginRight: 2 }}
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
        </ListItem>
      ))}
    </List>
  );
};

export default AvatarList;
