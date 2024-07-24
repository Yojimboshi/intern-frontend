import React, { useState } from 'react';
import { Button, TextField, Grid } from '@mui/material';


const AvatarForm = ({ avatar, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    image: avatar?.image || null,
    level: avatar?.level || '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result,
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert image ArrayBuffer to a buffer that can be sent to the backend
    const imageBuffer = formData.image ? new Uint8Array(formData.image) : null;

    const payload = {
      level: formData.level,
      image: imageBuffer,
    };

    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <input
            accept="image/*"
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="image-upload"
          />
          <label htmlFor="image-upload">
            <Button variant="contained" color="primary" component="span">
              Upload Image
            </Button>
          </label>
          {formData.image && (
            <img
              src={URL.createObjectURL(new Blob([formData.image]))}
              alt="Avatar Preview"
              style={{ marginTop: 10, maxWidth: '100%', height: 'auto' }}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            type="number"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
          <Button onClick={onCancel} variant="contained" color="secondary" style={{ marginLeft: 8 }}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AvatarForm;
