// src\views\apps\announcement\admin\announcementForm.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button, TextField, Grid } from '@mui/material';
import { AnnouncementType } from 'src/types/apps/announcementTypes';

interface AnnouncementFormProps {
  announcement?: AnnouncementType;
  onSave: (formData: AnnouncementType) => void;
  onCancel: () => void;
}

// Define a default announcement that matches one of the NotificationsType variants
const defaultAnnouncement: AnnouncementType = {
  id: 0,
  meta: '',
  title: '',
  subtitle: '',
  rewards: '',
  avatarAlt: '',
  avatarImg: '',
  content: '',
};

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ announcement, onSave, onCancel }) => {
  const [formData, setFormData] = useState<AnnouncementType>(announcement || defaultAnnouncement);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="subtitle"
            label="Subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="content"
            label="Content"
            value={formData.content}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="rewards"
            label="Rewards"
            value={formData.rewards || ''}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
          <Button variant="outlined" color="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AnnouncementForm;
