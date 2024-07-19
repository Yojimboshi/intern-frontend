import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AnnouncementList from 'src/views/apps/announcement/announcementList';
import authConfig from 'src/configs/auth'

const AnnouncementListPage = () => {
  const [announcements, setAnnouncements] = useState([]);


  const getUserId = async (): Promise<number | null> => {
    const userEndpoint = authConfig.meEndpoint;
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);

    try {
      const response = await axios.get(userEndpoint, {
        headers: { Authorization: `Bearer ${storedToken}` }
      });

      const userData = response.data;
      const userId = userData.id;

      return userId;
    } catch (error) {
      console.error('Error fetching user ID:', error);

      return null;
    }
  }

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const userId = await getUserId();
    const userId1 = 1;

    if (userId === null) {
      console.error('User is not logged in');

      return;
    }

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/announcements/user/${userId1}`);
      setAnnouncements(response.data);
      console.log("Announcement data", response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  return (
    <div>
      <h1>Announcements</h1>
      <AnnouncementList announcements={announcements} />
    </div>
  );
};

export default AnnouncementListPage;
