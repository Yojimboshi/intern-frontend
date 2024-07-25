import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios'
import AnnouncementForm from 'src/views/apps/announcement/admin/announcementForm';
import AnnouncementList from 'src/views/apps/announcement/admin/announcementList';
import { useDeleteAnnouncement, useSaveAnnouncement } from 'src/hooks/useAnnounce';
import authConfig from 'src/configs/auth';

const AnnouncementAdminPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);

  const deleteAnnouncement = useDeleteAnnouncement();
  const saveAnnouncement = useSaveAnnouncement();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      console.log('Fetching announcement');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/announcements`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      });
      setAnnouncements(response.data);
      console.log('List of announcement:', response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const handleSaveAnnouncement = async (announcement: { id: any; content: any; title: any; subtitle: any; rewards: any; }) => {
    await saveAnnouncement(announcement);
    fetchAnnouncements();
    setShowForm(false);
    setEditingAnnouncement(null);
  };

  const handleDeleteAnnouncement = async (id: number) => {
    await deleteAnnouncement(id);
    fetchAnnouncements();
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4">Admin Announcements</Typography>
        <Button onClick={() => setShowForm(true)} startIcon={<AddIcon />}>
          Add Announcement
        </Button>
        {showForm && (
          <AnnouncementForm
            announcement={editingAnnouncement}
            onSave={handleSaveAnnouncement}
            onCancel={() => {
              setShowForm(false);
              setEditingAnnouncement(null);
            }}
          />
        )}
      </Grid>
      <Grid item xs={12}>
        <AnnouncementList
          announcements={announcements}
          onEdit={(announcement: React.SetStateAction<null>) => {
            setEditingAnnouncement(announcement);
            setShowForm(true);
          }}
          onDelete={handleDeleteAnnouncement}
        />
      </Grid>
    </Grid>
  );
};

export default AnnouncementAdminPage;
