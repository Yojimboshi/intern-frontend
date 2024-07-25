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
        // Convert ArrayBuffer to Base64 string
        const base64String = arrayBufferToBase64(reader.result);
        setFormData({
          ...formData,
          image: base64String,  // Storing Base64 encoded string
        });
      };
      reader.readAsArrayBuffer(file); // Read the file as ArrayBuffer
    }
  };

  // Helper function to convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return window.btoa(binary);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // No need to convert image to Base64, send raw binary data directly
    const payload = {
      level: formData.level,
      image: formData.image, // Raw binary data
    };

    onSave(payload); // Send the payload to the parent component
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
              src={`data:image/jpeg;base64,${formData.image}`} // Displaying the image preview as a Base64 encoded string
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
