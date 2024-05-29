// src\pages\apps\hierarchy\addUser\index.tsx

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { styled } from '@mui/material/styles';
import {
  Grid, Box, Button, FormControl, FormControlLabel, FormHelperText, InputLabel,
  MenuItem, Radio, RadioGroup, Select, TextField, Typography, Checkbox,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress
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
  const [loading, setLoading] = useState(false);
  const [activateUser, setActivateUser] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [addedUser, setAddedUser] = useState<UserData | null>(null);
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
    setLoading(true);
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
        const payload = { ...data };
        dispatch(addDownlineUser(payload));
        setAddedUser(payload);

        if (activateUser) {
          setOpenDialog(true);
        } else {
          reset(defaultValues);
        }
      }
    } catch (error) {
      console.error('Error during form submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivateUser = async () => {
    if (!addedUser) return;

    const selectedPackage = packages.find(pkg => pkg.id === addedUser.packageId);

    if (!selectedPackage) {
      console.error('Selected package not found');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/crypto/activate-downline', { downlineUsername: addedUser.username, depositAmount: selectedPackage.price });
      console.log('Downline user activated successfully');
      setOpenDialog(false);
      reset(defaultValues);
    } catch (error) {
      console.error('Failed to activate downline user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    reset(defaultValues);
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
                  <TextField {...field} label="Username" error={!!errors.username} helperText={errors.username?.message}
                    onChange={(e) => handleInputChange('username', e.target.value)} />
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
                  <TextField {...field} label="Email" error={!!errors.email} helperText={errors.email?.message}
                    onChange={(e) => handleInputChange('email', e.target.value)} />
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
                  <TextField {...field} label="First Name" error={!!errors.firstName} helperText={errors.firstName?.message}
                    onChange={(e) => handleInputChange('firstName', e.target.value)} />
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
                  <TextField {...field} label="Last Name" error={!!errors.lastName} helperText={errors.lastName?.message}
                    onChange={(e) => handleInputChange('lastName', e.target.value)} />
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
                  <TextField {...field} label="Password" type="password" error={!!errors.password} helperText={errors.password?.message}
                    onChange={(e) => handleInputChange('password', e.target.value)} />
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
                  <TextField {...field} label="Retype Password" type="password" error={!!errors.retypePassword} helperText={errors.retypePassword?.message}
                    onChange={(e) => handleInputChange('retypePassword', e.target.value)} />
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
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Checkbox checked={activateUser} onChange={(e) => setActivateUser(e.target.checked)} />}
                label="Activate User"
              />
            </Grid>
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Add User
            </Button>
          </Grid>
        </Grid>
      </form>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Activate User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to activate this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleActivateUser} color="primary" autoFocus disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Activate'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

};

export default AddUser;
