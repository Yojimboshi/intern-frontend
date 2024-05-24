// src\pages\apps\hierarchy\addUser\index.tsx

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { styled } from '@mui/material/styles';
import {
  Grid, Box, Button, FormControl, FormControlLabel, FormHelperText, InputLabel,
  MenuItem, Radio, RadioGroup, Select, TextField, Typography
} from '@mui/material';
import { addDownlineUser } from 'src/store/apps/user';
import { AppDispatch } from 'src/store';
import Icon from 'src/@core/components/icon';
import axios from 'src/configs/axiosConfig';


interface Package {
  id: string | number;
  packageName: string;
  price: number;
  sponsorBonusPercentage: number;
  matchingBonusPercentage: number;
  hierarchyBonusPercentage: number;
  maxHierarchyChildren: number;
}

interface UserData {
  username: string;
  email: string;
  contact: number;
  firstName: string;
  lastName: string;
  password: string;
  packageId: string;
  role: 'member';
  // position: 'left' | 'right' | '';
  retypePassword: string;
  isEmpty: boolean;
}

const showErrors = (field: string, value: string | undefined, min: number, max = 20) => {
  const valueLen = value?.length || 0;
  if (valueLen === 0) {
    return `${field} field is required`;
  } else if (valueLen < min) {
    return `${field} must be at least ${min} characters`;
  } else if (valueLen > max) {
    return `${field} must be at most ${max} characters`;
  }

  return '';
};

const schema = yup.object().shape({
  email: yup.string().email().required(),
  username: yup.string()
    .min(3, obj => showErrors('Username', obj.value.length, obj.min))
    .required('Username is required'),
  firstName: yup.string()
    .min(3, obj => showErrors('First Name', obj.value.length, obj.min))
    .required('First Name is required'),
  lastName: yup.string()
    .min(3, obj => showErrors('Last Name', obj.value.length, obj.min))
    .required('Last Name is required'),
  password: yup.string()
    .min(5, 'Password must be at least 5 characters')
    .required('Password is required'),
  retypePassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Retype Password is required'),
});

const defaultValues: UserData = {
  username: '',
  email: '',
  role: 'member',
  contact: 123,
  firstName: '',
  lastName: '',
  // position: 'left',
  password: '',
  packageId: '',
  retypePassword: '',
  isEmpty: false
};

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}));


const AddUser = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const { reset, setError, control, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const storedPackages = localStorage.getItem('planPackages');
        if (storedPackages) {
          setPackages(JSON.parse(storedPackages));
        } else {
          const response = await axios.get('users/packages');
          const fetchedPackages: Package[] = response.data.packages;
          localStorage.setItem('planPackages', JSON.stringify(fetchedPackages));
          setPackages(fetchedPackages);
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchPackages();
  }, []);

  const handleInputChange = (name: keyof UserData, value: any) => {
    setValue(name, value);
  };

  const onSubmit = async (data: UserData) => {
    try {
      console.log('Submit button pressed', data);

      const allData = JSON.parse(localStorage.getItem('allUserData') || '[]');
      if (allData.some((u: any) => u.email === data.email || u.username === data.username)) {
        allData.forEach((u: any) => {
          if (u.email === data.email) {
            setError('email', {
              message: 'Email already exists!'
            });
          }
          if (u.username === data.username) {
            setError('username', {
              message: 'Username already exists!'
            });
          }
        });
      } else {
        try {
          const payload = { ...data };
          console.log('Payload for submission:', payload);

          dispatch(addDownlineUser(payload));
          reset(defaultValues);
        } catch (error: any) {
          console.error('Error adding user:', error.response || error.message);
          console.log('Error details:', error);
        }
      }
    } catch (error) {
      console.error('Error during form submission:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Header>
        <Typography variant="h6" gutterBottom>
          Add User
        </Typography>
      </Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Username" error={!!errors.username} helperText={errors.username?.message} />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Email" error={!!errors.email} helperText={errors.email?.message} />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="First Name" error={!!errors.firstName} helperText={errors.firstName?.message} />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Last Name" error={!!errors.lastName} helperText={errors.lastName?.message} />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Password" type="password" error={!!errors.password} helperText={errors.password?.message} />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <Controller
                name="retypePassword"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Retype Password" type="password" error={!!errors.retypePassword} helperText={errors.retypePassword?.message} />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="package-label">Package</InputLabel>
              <Controller
                name="packageId"
                control={control}
                render={({ field }) => (
                  <Select {...field} labelId="package-label" label="Package" error={!!errors.packageId}>
                    {packages.map(pkg => (
                      <MenuItem key={pkg.id} value={pkg.id}>{pkg.packageName}</MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.packageId && <FormHelperText error>{errors.packageId.message}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Add User
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );

};

export default AddUser;
