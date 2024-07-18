import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Grid, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AnnouncementForm from 'src/views/apps/announcement/admin/AnnouncementForm';
import AnnouncementList from 'src/views/apps/announcement/admin/AnnouncementList';

const AnnouncementAdminPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [showForm, setShowForm] = useState(false);

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

  const handleSaveAnnouncement = async (announcement) => {
    try {
      if (announcement.id) {
        await axios.put(`/api/announcements/${announcement.id}`, announcement);
      } else {
        await axios.post('/api/announcements', announcement);
      }
      fetchAnnouncements();
      setShowForm(false);
      setEditingAnnouncement(null);
    } catch (error) {
      console.error('Error saving announcement:', error);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await axios.delete(`/api/announcements/${id}`);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
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
          onEdit={(announcement) => {
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
