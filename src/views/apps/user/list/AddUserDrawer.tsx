// src\views\apps\user\list\AddUserDrawer.tsx
import { useState, useEffect } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Checkbox from '@mui/material/Checkbox'
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
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from 'src/store/apps/user'
import axios from 'src/configs/axiosConfig';

import { RootState, AppDispatch } from 'src/store'
import { UsersType } from 'src/types/apps/userTypes'
import Translations from 'src/layouts/components/Translations';

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
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
  role: 'admin' | 'member';
  position: 'left' | 'right' | '';
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
  role: 'member',
  contact: 123,
  firstName: '',
  lastName: '',
  position: 'left',
  password: '',
  packageId: '',
  retypePassword: '',
  isEmpty: false
};

const SidebarAddUser = (props: SidebarAddUserType) => {
  // ** Props
  const { open, toggle } = props;
  const [packages, setPackages] = useState<Package[]>([]);
  const [formValues, setFormValues] = useState<UserData>(defaultValues);

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.user)
  const {
    reset,
    setError,
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues: formValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const storedPackages = localStorage.getItem('planPackages');
        if (storedPackages) {
          setPackages(JSON.parse(storedPackages));
        } else {
          const response = await axios.get(`admin/packages`);
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
    setFormValues(prev => ({ ...prev, [name]: value }));
    setValue(name, value);
  };

  const onSubmit = async (data: UserData) => {
    try {
      console.log('Submit button pressed', data);

      if (store.allData.some((u: UsersType) => u.email === data.email || u.username === data.username)) {
        store.allData.forEach((u: UsersType) => {
          if (u.email === data.email) {
            setError('email', {
              message: 'Email already exists!'
            })
          }
          if (u.username === data.username) {
            setError('username', {
              message: 'Username already exists!'
            })
          }
        })
      } else {
        try {
          // Debug log to check the payload
          const payload = {
            ...data
          };
          console.log('Payload for submission:', payload);

          // redux handle all API request
          dispatch(addUser(payload));
          setFormValues(data);
          toggle();
          reset();
        } catch (error: any) {
          console.error('Error adding user:', error.response || error.message);

          // Debug log to check what kind of error is thrown
          console.log('Error details:', error);
        }
      }
    } catch (error) {
      console.error('Error during form submission:', error);
    }
  };

  const handleClose = () => {
    toggle();
    reset(formValues);
  }

  useEffect(() => {
    if (open) {
      reset(formValues);
    }
  }, [open, formValues, reset]);

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
        <Typography variant='h6'><Translations text='Add User' /></Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='username'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={<Translations text='Username' />}
                  error={Boolean(errors.username)}
                  onChange={(e) => handleInputChange('username', e.target.value)}
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
                  label={<Translations text='Email' />}
                  error={Boolean(errors.email)}
                  onChange={(e) => handleInputChange('email', e.target.value)}
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
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label={<Translations text='First Name' />}
                  onChange={onChange}
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
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label={<Translations text='Last Name' />}
                  onChange={onChange}
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
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label={<Translations text='Password' />}
                  onChange={onChange}
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
                  label={<Translations text='Retype Password' />}
                  error={Boolean(errors.retypePassword)}
                  onChange={(e) => handleInputChange('retypePassword', e.target.value)}
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
                  label={<Translations text='Parent User' />}
                  error={Boolean(errors.parentUsername)}
                  onChange={(e) => handleInputChange('parentUsername', e.target.value)}
                />
              )}
            />
            {errors.parentUsername && <FormHelperText sx={{ color: 'error.main' }}>{errors.parentUsername.message}</FormHelperText>}
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 6 }}>
            <Typography component="div" sx={{ mr: 2 }}>
              <Translations text='Position' />:
            </Typography>
            <Controller
              name='position'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <RadioGroup
                  row
                  aria-labelledby='position-label'
                  name='position-radio-buttons-group'
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    handleInputChange('position', e.target.value);
                  }}
                  sx={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <FormControlLabel value='left' control={<Radio />} label={<Translations text='Left' />} />
                  <FormControlLabel value='right' control={<Radio />} label={<Translations text='Right' />} />
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
                  type='number'
                  {...field}
                  label={<Translations text='Contact' />}
                  error={Boolean(errors.contact)}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                />
              )}
            />
            {errors.contact && <FormHelperText sx={{ color: 'error.main' }}>{errors.contact.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel id='role-select-label'><Translations text='Select Role' /></InputLabel>
            <Controller
              name='role'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId='role-select-label'
                  id='role-select'
                  label={<Translations text='Select Role' />}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                >
                  <MenuItem value='admin'><Translations text='Admin' /></MenuItem>
                  <MenuItem value='member'><Translations text='Member' /></MenuItem>
                </Select>
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel id='plan-select-label'><Translations text='Select Plan' /></InputLabel>
            <Controller
              name='packageId'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId='plan-select-label'
                  id='plan-select'
                  label={<Translations text='Select Plan' />}
                  onChange={(e) => handleInputChange('packageId', e.target.value)}
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
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='isEmpty'
              control={control}
              rules={{ required: false }}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      onChange={(e) => handleInputChange('isEmpty', e.target.checked)}
                    />
                  }
                  label={<Translations text='Is Empty' />}
                />
              )}
            />
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
              <Translations text='Submit' />
            </Button>
            <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
              <Translations text='Cancel' />
            </Button>
          </Box>

        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddUser
