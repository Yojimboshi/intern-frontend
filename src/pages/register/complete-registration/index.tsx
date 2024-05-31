// src\pages\register\complete-registration\index.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import { Button, Box, Typography, TextField, Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';
import axiosInstance from 'src/configs/axiosConfig';
import { PackageType } from 'src/types/apps/userTypes'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';


interface FormData {
  firstName: string;
  lastName: string;
  referredBy: string;
  packageId: string;
}

const schema = yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  referredBy: yup.string().optional(),
  packageId: yup.string().required('Package is required')
});

const CompleteRegistration = () => {
  const router = useRouter();
  const [packages, setPackages] = useState<PackageType[]>([]);
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    const fetchUserState = async () => {
      try {
        const response = await axiosInstance.get('/users/current'); // Assuming this endpoint returns the current user's state
        const user = response.data;

        if (user.registrationComplete === false) {
          // Stay on this page
        } else if (user.packageActivated === false) {
          router.replace('/register/complete-registration/activate');
        } else {
          const returnUrl = router.query.returnUrl;
          const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/';
          router.replace(redirectURL as string);
        }
      } catch (error) {
        console.error('Failed to fetch user state:', error);
      }
    };

    const fetchPackages = async () => {
      try {
        const response = await axiosInstance.get('/users/packages');
        setPackages(response.data.packages);
      } catch (error) {
        console.error('Failed to fetch packages:', error);
      }
    };

    fetchUserState();
    fetchPackages();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      // Send data to your backend to update user information
      await axiosInstance.put('/users/update', data);
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
      <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit(onSubmit)}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="First Name"
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                fullWidth
              />
            )}
          />
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Last Name"
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                fullWidth
              />
            )}
          />
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Controller
            name="referredBy"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Referred By (Optional)"
                error={!!errors.referredBy}
                helperText={errors.referredBy?.message}
                fullWidth
              />
            )}
          />
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="package-label">Package</InputLabel>
          <Controller
            name="packageId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                labelId="package-label"
                label="Package"
                error={!!errors.packageId}
              >
                {packages.map(pkg => (
                  <MenuItem key={pkg.id} value={pkg.id}>
                    {pkg.packageName}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.packageId && <FormHelperText error>{errors.packageId.message}</FormHelperText>}
        </FormControl>
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
