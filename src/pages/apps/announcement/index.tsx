// src/pages/apps/announcement/index.tsx
import React, { useState, useEffect } from 'react';
import AnnouncementList from 'src/views/apps/announcement/announcementList';
import Translations from 'src/layouts/components/Translations';
import {
  Container, Typography, CircularProgress, Card, CardContent, Box,
} from '@mui/material';
import useAnnouncements from 'src/hooks/useAnnounce';

const AnnouncementListPage = () => {
  const {
    announcements,
    fetchAnnouncementsUser,
    likeAnnouncement,
    claimAnnouncement
  } = useAnnouncements();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await fetchAnnouncementsUser();
      setLoading(false);
    };

    fetchData();
  }, [fetchAnnouncementsUser]);

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        <Translations text="Announcements" />
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <Card>
          <CardContent>
            <AnnouncementList
              announcements={announcements}
              onLike={likeAnnouncement}
              onClaimRewards={claimAnnouncement}
            />
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default AnnouncementListPage;
