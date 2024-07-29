// src/pages/apps/announcement/announcementListPage.tsx
import React, { useEffect, useState } from 'react';
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
    claimAnnouncement,
  } = useAnnouncements();
  const [loading, setLoading] = useState(true);

  // Fetch announcements on component mount
  useEffect(() => {
    const fetchData = async () => {
      await fetchAnnouncementsUser();
      setLoading(false);
    };
    fetchData();
  }, [fetchAnnouncementsUser]);

  // Handle like action
  const handleLike = async (announcementId: number) => {
    await likeAnnouncement(announcementId);
    await fetchAnnouncementsUser(); // Refresh announcements after liking
  };

  // Handle claim rewards action
  const handleClaimRewards = async (announcementId: number) => {
    await claimAnnouncement(announcementId);
    await fetchAnnouncementsUser(); // Refresh announcements after claiming rewards
  };

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
              onLike={handleLike}
              onClaimRewards={handleClaimRewards}
            />
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default AnnouncementListPage;
