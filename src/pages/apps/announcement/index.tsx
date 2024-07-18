import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AnnouncementList from 'src/views/apps/announcement/AnnouncementList';

const AnnouncementListPage = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('/api/announcements');
      setAnnouncements(response.data);
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
