import React, { useState } from 'react';
import { Button, TextField, Grid } from '@mui/material';



const AnnouncementForm = ({ announcement, onSave, onCancel }) => {
  const [formData, setFormData] = useState(announcement || { title: '', subtitle: '', content: '', rewards: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Subtitle"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Rewards"
            name="rewards"
            value={formData.rewards}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Create
          </Button>
          <Button onClick={onCancel} variant="contained" color="secondary" style={{ marginLeft: 8 }}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AnnouncementForm;
