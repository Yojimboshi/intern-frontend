import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AnnouncementList from 'src/views/apps/announcement/announcementList';
import authConfig from 'src/configs/auth';
import Translations from 'src/layouts/components/Translations';
import {
  Container, Typography, CircularProgress, Card, CardContent, Box,
} from '@mui/material';


const AnnouncementListPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch user ID
  const getUserId = async (): Promise<number | null> => {
    const userEndpoint = authConfig.meEndpoint;
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);

    try {
      const response = await axios.get(userEndpoint, {
        headers: { Authorization: `Bearer ${storedToken}` }
      });

      const userData = response.data;

      return userData.id;
    } catch (error) {
      console.error('Error fetching user ID:', error);

      return null;
    }
  };

  // Function to fetch announcements
  const fetchAnnouncements = async () => {
    const userId = await getUserId();

    if (userId === null) {
      console.error('User is not logged in');
      setLoading(false);

      return;
    }

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/announcements/user/${userId}`);
      setAnnouncements(response.data);
      console.log("Announcement data", response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch announcements on component mount
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Handle like action
  const handleLike = async (announcementId: number) => {
    const userId = await getUserId();
    if (userId) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/announcements/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem(authConfig.storageTokenKeyName)}`
          },
          body: JSON.stringify({ userId, announcementId })
        });

        if (response.ok) {
          console.log('Liked the notification');

          fetchAnnouncements();
        } else {
          console.error('Failed to like the notification');
        }
      } catch (error) {
        console.error('Error liking the notification', error);
      }
    }
  };

  // Handle claim rewards action
  const handleClaimRewards = async (announcementId: number) => {
    const userId = await getUserId();
    if (userId) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/announcements/claim-rewards`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem(authConfig.storageTokenKeyName)}`
          },
          body: JSON.stringify({ userId, announcementId })
        });

        if (response.ok) {
          console.log('Rewards claimed');

          fetchAnnouncements();
        } else {
          console.error('Failed to claim rewards');
        }
      } catch (error) {
        console.error('Error claiming rewards', error);
      }
    }
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
