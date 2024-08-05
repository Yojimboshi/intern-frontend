// src/pages/apps/announcement/admin/index.tsx
import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AnnouncementForm from 'src/views/apps/announcement/admin/announcementForm';
import AnnouncementList from 'src/views/apps/announcement/admin/announcementList';
import useAnnouncements from 'src/hooks/useAnnounce';
import { AnnouncementType } from 'src/types/apps/announcementTypes';

const AnnouncementAdminPage = () => {
  const {
    announcements,
    fetchAnnouncements,
    deleteAnnouncement,
    saveAnnouncement,
  } = useAnnouncements();
  const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementType | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSaveAnnouncement = async (announcement: AnnouncementType) => {
    await saveAnnouncement(announcement);
    fetchAnnouncements();
    setShowForm(false);
    setEditingAnnouncement(undefined);
    console.log
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
              setEditingAnnouncement(undefined);
            }}
          />
        )}
      </Grid>
      <Grid item xs={12}>
        <AnnouncementList
          announcements={announcements}
          onEdit={(announcement: AnnouncementType) => {
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
