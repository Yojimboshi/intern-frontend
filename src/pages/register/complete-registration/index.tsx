// src\pages\register\complete-registration\index.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Box, Typography, TextField } from '@mui/material';
import axiosInstance from 'src/configs/axiosConfig';

const CompleteRegistration = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    referredBy: '',
    packageId: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCompleteRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Send data to your backend to update user information
      await axiosInstance.post('/user/update', formData);
      router.push('/register/complete-registration/activate'); // Redirect to activation page
    } catch (error) {
      console.error('Failed to complete registration:', error);
    }
  };

  return (
    <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography component="h1" variant="h5">
        Complete Your Registration
      </Typography>
      <Box component="form" sx={{ mt: 1 }} onSubmit={handleCompleteRegistration}>
        <TextField
          name="firstName"
          label="First Name"
          value={formData.firstName}
          onChange={handleInputChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          name="lastName"
          label="Last Name"
          value={formData.lastName}
          onChange={handleInputChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          name="referredBy"
          label="Referred By"
          value={formData.referredBy}
          onChange={handleInputChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          name="packageId"
          label="Package ID"
          value={formData.packageId}
          onChange={handleInputChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          type="submit"
        >
          Complete Registration
        </Button>
      </Box>
    </Box>
  );
};

export default CompleteRegistration;
