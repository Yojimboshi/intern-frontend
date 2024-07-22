
import { List, ListItem, ListItemText, IconButton, Typography } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const AnnouncementList = ({ announcements, onLike, onClaimRewards }) => {

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
        </ListItem>
      ))}
    </List>
  );
};

export default AnnouncementList;
