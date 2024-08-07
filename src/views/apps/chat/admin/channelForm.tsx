// src/views/apps/chat/ChannelForm.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button, TextField, Grid } from '@mui/material';
import { ChatsArrType } from 'src/types/apps/chatTypes';

interface ChannelFormProps {
  channel?: ChatsArrType;
  onSave: (formData: ChatsArrType) => void;
  onCancel: () => void;
}

// Define a default channel that matches the ChannelType structure
const defaultChannel: ChatsArrType = {
  id: 0,
  role: '',
  about: '',
  fullName: '',
  status: 'online'
};

const ChannelForm: React.FC<ChannelFormProps> = ({ channel, onSave, onCancel }) => {
  const [formData, setFormData] = useState<ChatsArrType>(channel || defaultChannel);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'active' ? value === 'true' : value, // Convert 'active' field to boolean
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="name"
            label="Name"
            value={formData.fullName}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="description"
            label="Description"
            value={formData.about}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="active"
            label="Active"
            value={formData.status ? 'true' : 'false'}
            onChange={handleChange}
            fullWidth
            select
            SelectProps={{
              native: true,
            }}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </TextField>
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

export default ChannelForm;
