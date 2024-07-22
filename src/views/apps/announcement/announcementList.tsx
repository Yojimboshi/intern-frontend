import React, { useState } from 'react';
import { List, ListItem, ListItemText, IconButton, Typography } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import VisibilityIcon from '@mui/icons-material/Visibility';

const AnnouncementList = ({ announcements, onLike, onClaimRewards }) => {
  const [seenAnnouncements, setSeenAnnouncements] = useState([]);

  const handleMarkAsSeen = (announcementId) => {
    if (!seenAnnouncements.includes(announcementId)) {
      setSeenAnnouncements([...seenAnnouncements, announcementId]);
    }
  };

  return (
    <List>
      {announcements.map((announcement) => (
        <ListItem key={announcement.id} divider>
          <ListItemText
            primary={announcement.title}
            secondary={
              <>
                <Typography component="span">{announcement.subtitle}</Typography>
                {announcement.rewards && (
                  <>
                    <br />
                    <Typography component="span" variant="body2" color="textSecondary">
                      Rewards: {announcement.rewards}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2" color="textSecondary">
                      Date: {announcement.meta}
                    </Typography>
                  </>
                )}
              </>
            }
          />
          <IconButton onClick={() => onLike(announcement.id)} color="primary">
            <ThumbUpIcon />
          </IconButton>
          {announcement.rewards && (
            <IconButton onClick={() => onClaimRewards(announcement.id)} color="secondary">
              <AttachMoneyIcon />
            </IconButton>
          )}
          <IconButton onClick={() => handleMarkAsSeen(announcement.id)} color="default">
            <VisibilityIcon />
          </IconButton>
          {seenAnnouncements.includes(announcement.id) && (
            <Typography variant="body2" color="textSecondary" style={{ marginLeft: '8px' }}>
              Seen
            </Typography>
          )}
        </ListItem>
      ))}
    </List>
  );
};

export default AnnouncementList;
