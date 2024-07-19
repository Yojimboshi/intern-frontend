import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Grid, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AnnouncementForm from 'src/views/apps/announcement/admin/announcementForm';
import AnnouncementList from 'src/views/apps/announcement/admin/announcementList';
import authConfig from 'src/configs/auth';

const AnnouncementAdminPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);

  useEffect(() => {
    fetchAnnouncements();
  }, []);
  // NOTE:cleanup,  use import hooks, from useAnnounce
  const fetchAnnouncements = async () => {
    try {
      console.log("Fetching announcement");
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/announcements`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      });
      setAnnouncements(response.data);
      console.log("List of announcement:", response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };
  // NOTE: type fix too
  const handleSaveAnnouncement = async (announcement) => {
    try {
      if (announcement.id) {
        console.log("Updating announcement:", announcement);
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/announcements/${announcement.id}`,
          {
            message: announcement.content,
            title: announcement.title,
            subtitle: announcement.subtitle,
            rewards: announcement.rewards,
          },
          {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          }
        );
      } else {
        console.log("Creating new announcement");
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/announcements`,
          {
            message: announcement.content,
            title: announcement.title,
            subtitle: announcement.subtitle,
            rewards: announcement.rewards,
          },
          {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          }
        );
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
      console.log("Deleting announcement:", id);
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/announcements/${id}`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      });
      console.log("Deleted successfully");
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
