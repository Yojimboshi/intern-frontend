// src\views\components\tree-view\AddChildDrawer.tsx
import { useState, useEffect } from 'react'
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import axios from 'src/configs/axiosConfig';

interface SideBarAddChildType {
  open: boolean;
  toggle: () => void;
  position?: 'left' | 'right';
  parentUsername?: string;
  handleNodeSelect: () => void;
}

interface Package {
  id: string | number;
  packageName: string;
  price: number;
  referralBonusPercentage: number;
  miningBonusPercentage: number;
  signupBonus: number;
  activityBonus: number;
}

interface UserData {
  username: string
  email: string
  parentUsername: string
  contact: number
  firstName: string;
  lastName: string;
  password: string;
  packageId: string;
  position: 'left' | 'right' | undefined;
  retypePassword: string;
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

// const passwordErrors = (password: string | undefined) => {
//   if (!password) {
//     return 'Password field is required';
//   } else if (password.length < 5) {
//     return 'Password must be at least 5 characters';
//   }
//   // Uncomment the following lines if needed
//   /*
//   if (!/\d/.test(password)) {
//     return 'Password must contain a number';
//   } else if (!/[A-Z]/.test(password)) {
//     return 'Password must contain an uppercase letter';
//   } else if (!/[a-z]/.test(password)) {
//     return 'Password must contain a lowercase letter';
//   }
//   */

//   return '';
// };



const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

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
  parentUsername: '',
  contact: 0,
  firstName: '',
  lastName: '',
  position: undefined,
  password: '',
  packageId: '',
  retypePassword: ''
};

const SidebarAddChild = (props: SideBarAddChildType) => {
  // ** Props
  const { open, toggle, position, parentUsername = '', handleNodeSelect } = props;
  const [packages, setPackages] = useState<Package[]>([]);
  const [formValues] = useState<UserData>(defaultValues);

  const formInitialValues: UserData = {
    ...defaultValues,
    position,
    parentUsername
  };

  // ** Hooks
  const {
    reset,
    setError,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: formInitialValues,
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
          const response = await axios.get(`users/packages`);
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

  useEffect(() => {
    if (open) {
      console.log('Position before reset:', position); // Debug the position value
      reset(formInitialValues);
    }
  }, [open, position]);

  const onSubmit = async (data: UserData) => {
    console.log('Submit button pressed', data);

    const payload = {
      ...data,
      position,
      parentUsername,
    };

    try {
      const response = await axios.post(`/users/child-package`, payload);
      console.log('Child package added:', response.data);
      toggle(); // Close the drawer
      handleNodeSelect();
    } catch (error: any) {
      console.error('Error adding child package:', error.response || error.message);
      setError(error.response?.data?.field || 'username', { message: error.response?.data?.message || 'An error occurred' });
    }
  };

  const handleClose = () => {
    toggle();
    reset(formValues);
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>Add User</Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="username"
              control={control}
              rules={{ required: 'Username is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Username"
                  error={!!errors.username}
                  helperText={errors.username?.message}
                />
              )}
            />
            {errors.username && <FormHelperText sx={{ color: 'error.main' }}>{errors.username.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='email'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type='email'
                  label='Email'
                  error={Boolean(errors.email)}
                />
              )}
            />
            {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='firstName'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='First Name'
                  error={Boolean(errors.firstName)}
                />
              )}
            />
            {errors.firstName && <FormHelperText sx={{ color: 'error.main' }}>{errors.firstName.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='lastName'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Last Name'
                  error={Boolean(errors.lastName)}
                />
              )}
            />
            {errors.lastName && <FormHelperText sx={{ color: 'error.main' }}>{errors.lastName.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='password'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Password'
                  error={Boolean(errors.password)}
                />
              )}
            />
            {errors.password && <FormHelperText sx={{ color: 'error.main' }}>{errors.password.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='retypePassword'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Retype Password'
                  type='password'
                  error={Boolean(errors.retypePassword)}
                />
              )}
            />
            {errors.retypePassword && <FormHelperText sx={{ color: 'error.main' }}>{errors.retypePassword.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='parentUsername'
              control={control}
              rules={{ required: false }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Parent User'
                  error={Boolean(errors.parentUsername)}
                />
              )}
            />
            {errors.parentUsername && <FormHelperText sx={{ color: 'error.main' }}>{errors.parentUsername.message}</FormHelperText>}
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 6 }}>
            <Typography component="div" sx={{ mr: 2 }}>
              Position:
            </Typography>
            <Controller
              name='position'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <RadioGroup
                  row
                  {...field}
                  value={position || ''}
                  aria-labelledby='position-label'
                  name='position-radio-buttons-group'
                  sx={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <FormControlLabel value='left' control={<Radio />} label='Left' />
                  <FormControlLabel value='right' control={<Radio />} label='Right' />
                </RadioGroup>
              )}
            />
          </Box>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='contact'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Contact'
                  placeholder='(397) 294-5153'
                  error={Boolean(errors.contact)}
                />
              )}
            />
            {errors.contact && <FormHelperText sx={{ color: 'error.main' }}>{errors.contact.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel id='plan-select-label'>Select Plan</InputLabel>
            <Controller
              name='packageId'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId='plan-select-label'
                  id='plan-select'
                  label='Select Plan'
                >
                  {packages.map((pkg: Package) => (
                    <MenuItem key={pkg.id} value={pkg.id}>
                      {pkg.packageName} - ${pkg.price}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
              Submit
            </Button>
            <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddChild
