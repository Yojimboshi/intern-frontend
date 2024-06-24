// src\views\apps\user\view\UserViewLeft.tsx
import { useState, useEffect } from 'react'
import axios from 'src/configs/axiosConfig';

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import InputAdornment from '@mui/material/InputAdornment'
import LinearProgress from '@mui/material/LinearProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import UserSuspendDialog from 'src/views/apps/user/view/UserSuspendDialog'
import UserSubscriptionDialog from 'src/views/apps/user/view/UserSubscriptionDialog'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { UsersType } from 'src/types/apps/userTypes'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

interface ColorsType {
  [key: string]: ThemeColor
}

interface Plan {
  id: number;
  name: string;
  price: number; // Adjust the types for name and price as needed
}

const initialData: UsersType = {
  id: 1,
  role: 'member',
  status: 'active',
  accountStatus: 'active',
  username: 'default',
  avatarColor: 'primary',
  country: 'default',
  company: 'default',
  contact: '12345667',
  currentPlan: 'enterprise',
  fullName: 'Daisy Patterson',
  email: 'gslixby0@abc.net.au',
  avatar: '/images/avatars/4.png',
  package: {
    id: 4,
    packageName: 'V4',
    price: 1000,
    referralBonusPercentage: 10,
    miningBonusPercentage: 5,
    signupBonus: 2,
    activityBonus: 3,
  },
  isEmpty: false,
  packageId: "4",
}

const roleColors: ColorsType = {
  admin: 'error',
  editor: 'info',
  author: 'warning',
  maintainer: 'success',
  subscriber: 'primary'
}

const statusColors: ColorsType = {
  active: 'success',
  restricted: 'warning',
  banned: 'secondary'
}

// ** Styled <sup> component
const Sup = styled('sup')(({ theme }) => ({
  top: '0.2rem',
  left: '-0.6rem',
  position: 'absolute',
  color: theme.palette.primary.main
}))

// ** Styled <sub> component
const Sub = styled('sub')({
  fontWeight: 300,
  fontSize: '1rem',
  alignSelf: 'flex-end'
})

const UserViewLeft = () => {
  // ** States
  const [data, setData] = useState<UsersType>(initialData);
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [openPlans, setOpenPlans] = useState<boolean>(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState<boolean>(false)
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => setOpenEdit(false)

  // Handle Upgrade Plan dialog
  const handlePlansClickOpen = () => {
    fetchAndFilterPlans();
    setOpenPlans(true)
  }
  const handlePlansClose = () => setOpenPlans(false)

  const fetchAndUpdateUserData = async () => {
    try {
      const response = await axios.get('users/current');
      const currentUserData = response.data;

      localStorage.setItem('userData', JSON.stringify(currentUserData));

      setData(currentUserData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchAndFilterPlans = async () => {
    try {
      const response = await axios.get<{ packages: Plan[] }>('users/packages');
      const allPlans = response.data.packages;


      const currentUserPackagePrice = data.package && data.package.price ? data.package.price : null;

      // Filter plans
      const filteredPlans = allPlans.filter(plan => currentUserPackagePrice === null || plan.price > currentUserPackagePrice);
      setPlans(filteredPlans);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handlePlanChange = (event: any) => {
    console.log("Selected Plan:", event.target.value); // Debugging
    setSelectedPlan(event.target.value);
  };

  const handleUpgrade = async () => {
    try {
      // Assuming data has a userId property
      const userId = data.id;

      // Send a POST request to the backend to upgrade the plan
      const response = await axios.post('users/upgrades', { userId, newPackageId: selectedPlan });
      console.log('Upgrade successful:', response.data);
      await fetchAndUpdateUserData();
    } catch (error) {
      console.error('Error upgrading plan:', error);
    }
  };

  useEffect(() => {
    fetchAndUpdateUserData();
  }, []);

  if (data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              {data.avatar ? (
                <CustomAvatar
                  src={data.avatar}
                  variant='rounded'
                  alt={data.username}
                  sx={{ width: 120, height: 120, fontWeight: 600, mb: 4 }}
                />
              ) : (
                <CustomAvatar
                  skin='light'
                  variant='rounded'
                  color={data.avatarColor as ThemeColor}
                  sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: '3rem' }}
                >
                  {getInitials(data.username)}
                </CustomAvatar>
              )}
              <Typography variant='h6' sx={{ mb: 2 }}>
                {data.username}
              </Typography>
              <CustomChip
                skin='light'
                size='small'
                label={data.role}
                color={roleColors[data.role]}
                sx={{
                  height: 20,
                  fontWeight: 600,
                  borderRadius: '5px',
                  fontSize: '0.875rem',
                  textTransform: 'capitalize',
                  '& .MuiChip-label': { mt: -0.25 }
                }}
              />
            </CardContent>

            <CardContent sx={{ my: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ mr: 8, display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar skin='light' variant='rounded' sx={{ mr: 3 }}>
                    <Icon icon='mdi:check' />
                  </CustomAvatar>
                  <div>
                    <Typography variant='h6' sx={{ lineHeight: 1.3 }}>
                      1.23k
                    </Typography>
                    <Typography variant='body2'>Task Done</Typography>
                  </div>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar skin='light' variant='rounded' sx={{ mr: 3 }}>
                    <Icon icon='mdi:briefcase-variant-outline' />
                  </CustomAvatar>
                  <div>
                    <Typography variant='h6' sx={{ lineHeight: 1.3 }}>
                      568
                    </Typography>
                    <Typography variant='body2'>Project Done</Typography>
                  </div>
                </Box>
              </Box>
            </CardContent>

            <CardContent>
              <Typography variant="h6">Details</Typography>
              <Divider sx={{ mt: theme => `${theme.spacing(4)} !important` }} />
              <Box sx={{ pt: 2, pb: 1 }}>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant="subtitle2" sx={{ mr: 2, color: 'text.primary' }}>
                    Full Name:
                  </Typography>
                  <Typography variant="body2">{data.firstName} {data.lastName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant="subtitle2" sx={{ mr: 2, color: 'text.primary' }}>
                    Username:
                  </Typography>
                  <Typography variant="body2">@{data.username}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant="subtitle2" sx={{ mr: 2, color: 'text.primary' }}>
                    Email:
                  </Typography>
                  <Typography variant="body2">{data.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant="subtitle2" sx={{ mr: 2, color: 'text.primary' }}>
                    Role:
                  </Typography>
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    {data.role}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant="subtitle2" sx={{ mr: 2, color: 'text.primary' }}>
                    Account Status:
                  </Typography>
                  <CustomChip
                    skin="light"
                    size="small"
                    label={data.accountStatus ?? 'Unknown'}
                    color={statusColors[data.accountStatus?.toLowerCase() ?? 'default']}
                    sx={{
                      height: 20,
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      borderRadius: '5px',
                      textTransform: 'capitalize'
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant="subtitle2" sx={{ mr: 2, color: 'text.primary' }}>
                    Referral ID:
                  </Typography>
                  <Typography variant="body2">{data.referralId || 'N/A'}</Typography>
                </Box>
                {/* Additional bonus and package details can be added here */}
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant="subtitle2" sx={{ mr: 2, color: 'text.primary' }}>
                    Referral Bonus:
                  </Typography>
                  <Typography variant="body2">${data.package?.referralBonusPercentage}</Typography>
                </Box>
                {/* ... other bonus details ... */}
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant="subtitle2" sx={{ mr: 2, color: 'text.primary' }}>
                    Package:
                  </Typography>
                  <Typography variant="body2"> {data.package?.packageName ?? 'No Package'} - ${data.package?.price ?? 0}</Typography>
                </Box>
                {/* ... You can continue in this pattern for each field you need to display ... */}
              </Box>
            </CardContent>


            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClickOpen}>
                Edit
              </Button>
              <Button color='error' variant='outlined' onClick={() => setSuspendDialogOpen(true)}>
                Suspend
              </Button>
            </CardActions>

            <Dialog
              open={openEdit}
              onClose={handleEditClose}
              aria-labelledby='user-view-edit'
              aria-describedby='user-view-edit-description'
              sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
            >
              <DialogTitle
                id='user-view-edit'
                sx={{
                  textAlign: 'center',
                  fontSize: '1.5rem !important',
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                  pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                }}
              >
                Edit User Information
              </DialogTitle>
              <DialogContent
                sx={{
                  pb: theme => `${theme.spacing(8)} !important`,
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
                }}
              >
                <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
                  Updating user details will receive a privacy audit.
                </DialogContentText>
                <form>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label='First Name' defaultValue={data.firstName} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label='Last Name' defaultValue={data.lastName} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label='Username'
                        defaultValue={data.username}
                        InputProps={{ startAdornment: <InputAdornment position='start'>@</InputAdornment> }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth type='email' label='Billing Email' defaultValue={data.email} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id='user-view-status-label'>Status</InputLabel>
                        <Select
                          label='Status'
                          defaultValue={data.accountStatus}
                          id='user-view-status'
                          labelId='user-view-status-label'
                        >
                          <MenuItem value='pending'>Pending</MenuItem>
                          <MenuItem value='active'>Active</MenuItem>
                          <MenuItem value='inactive'>Inactive</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label='TAX ID' defaultValue='Tax-8894' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label='Contact' defaultValue={`+1 ${data.contact}`} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id='user-view-language-label'>Language</InputLabel>
                        <Select
                          label='Language'
                          defaultValue='English'
                          id='user-view-language'
                          labelId='user-view-language-label'
                        >
                          <MenuItem value='English'>English</MenuItem>
                          <MenuItem value='Spanish'>Spanish</MenuItem>
                          <MenuItem value='Portuguese'>Portuguese</MenuItem>
                          <MenuItem value='Russian'>Russian</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id='user-view-country-label'>Country</InputLabel>
                        <Select
                          label='Country'
                          defaultValue='USA'
                          id='user-view-country'
                          labelId='user-view-country-label'
                        >
                          <MenuItem value='USA'>USA</MenuItem>
                          <MenuItem value='UK'>UK</MenuItem>
                          <MenuItem value='Spain'>Spain</MenuItem>
                          <MenuItem value='Russia'>Russia</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        label='Use as a billing address?'
                        control={<Switch defaultChecked />}
                        sx={{ '& .MuiTypography-root': { fontWeight: 500 } }}
                      />
                    </Grid>
                  </Grid>
                </form>
              </DialogContent>
              <DialogActions
                sx={{
                  justifyContent: 'center',
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                  pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                }}
              >
                <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClose}>
                  Submit
                </Button>
                <Button variant='outlined' color='secondary' onClick={handleEditClose}>
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>

            <UserSuspendDialog open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
            <UserSubscriptionDialog open={subscriptionDialogOpen} setOpen={setSubscriptionDialogOpen} />
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ boxShadow: 'none', border: theme => `2px solid ${theme.palette.primary.main}` }}>
            <CardContent
              sx={{ display: 'flex', flexWrap: 'wrap', pb: '0 !important', justifyContent: 'space-between' }}
            >
              <CustomChip
                skin='light'
                size='small'
                color='primary'
                label='Standard'
                sx={{ fontSize: '0.75rem', borderRadius: '4px' }}
              />
              <Box sx={{ display: 'flex', position: 'relative' }}>
                <Sup>$</Sup>
                <Typography
                  variant='h3'
                  sx={{
                    mb: -1.2,
                    lineHeight: 1,
                    color: 'primary.main'
                  }}
                >
                  {data.package?.price ?? 0}
                </Typography>
                <Sub>/V{data.package?.id ?? 'N/A'}</Sub>
              </Box>
            </CardContent>

            <CardContent>
              <Box sx={{ mt: 4, mb: 5 }}>
                <Box
                  sx={{ display: 'flex', mb: 2.5, alignItems: 'center', '& svg': { mr: 2, color: 'text.secondary' } }}
                >
                  <Icon icon='mdi:circle' fontSize='0.625rem' />
                  <Typography component='span' sx={{ fontSize: '0.875rem' }}>
                    Referral Bonus: {data.package?.referralBonusPercentage ?? 'N/A'}%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    mt: 2.5,
                    display: 'flex',
                    mb: 2.5,
                    alignItems: 'center',
                    '& svg': { mr: 2, color: 'text.secondary' }
                  }}
                >
                  <Icon icon='mdi:circle' fontSize='0.625rem' />
                  <Typography component='span' sx={{ fontSize: '0.875rem' }}>
                    Mining Bonus: {data.package?.miningBonusPercentage ?? 'N/A'}%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    mt: 2.5,
                    display: 'flex',
                    mb: 2.5,
                    alignItems: 'center',
                    '& svg': { mr: 2, color: 'text.secondary' }
                  }}
                >
                  <Icon icon='mdi:circle' fontSize='0.625rem' />
                  <Typography component='span' sx={{ fontSize: '0.875rem' }}>
                    Hierarchy Bonus: {data.package?.signupBonus ?? 'N/A'}%
                  </Typography>
                </Box>

              </Box>
              <Box sx={{ display: 'flex', mb: 1.5, justifyContent: 'space-between' }}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  Days
                </Typography>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  26 of 30 Days
                </Typography>
              </Box>
              <LinearProgress value={86.66} variant='determinate' sx={{ height: 8, borderRadius: '5px' }} />
              <Typography variant='caption' sx={{ mt: 1.5, mb: 6 }}>
                4 days remaining
              </Typography>
              <Button variant='contained' sx={{ width: '100%' }} onClick={handlePlansClickOpen}>
                Upgrade Plan
              </Button>
            </CardContent>

            <Dialog
              open={openPlans}
              onClose={handlePlansClose}
              aria-labelledby='user-view-plans'
              aria-describedby='user-view-plans-description'
              sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
            >
              <DialogTitle
                id='user-view-plans'
                sx={{
                  textAlign: 'center',
                  fontSize: '1.5rem !important',
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                  pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                }}
              >
                Upgrade Plan
              </DialogTitle>

              <DialogContent
                sx={{ px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`] }}
              >
                <DialogContentText variant='body2' sx={{ textAlign: 'center' }} id='user-view-plans-description'>
                  Choose the best plan for you.
                </DialogContentText>
              </DialogContent>

              <DialogContent
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: ['wrap', 'nowrap'],
                  pt: theme => `${theme.spacing(2)} !important`,
                  pb: theme => `${theme.spacing(8)} !important`,
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
                }}
              >
                <FormControl fullWidth size='small' sx={{ mr: [0, 3], mb: [3, 0] }}>
                  <InputLabel id='user-view-plans-select-label'>Choose Plan</InputLabel>
                  <Select
                    label='Choose Plan'
                    value={selectedPlan}
                    onChange={handlePlanChange}
                    id='user-view-plans-select'
                    labelId='user-view-plans-select-label'
                  >
                    {plans.map(plan => (
                      <MenuItem key={plan.id} value={plan.id}>{plan.id} : ${plan.price}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button variant='contained' sx={{ minWidth: ['100%', 0] }} onClick={handleUpgrade}>
                  Upgrade
                </Button>
              </DialogContent>

              <Divider sx={{ m: '0 !important' }} />

              <DialogContent
                sx={{
                  pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(8)} !important`],
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                  pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                }}
              >
                <Typography sx={{ fontWeight: 500, mb: 2, fontSize: '0.875rem' }}>
                  User current plan is {data.package?.packageName}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: ['wrap', 'nowrap'],
                    justifyContent: 'space-between'
                  }}
                >
                  <Box sx={{ mr: 3, display: 'flex', ml: 2.4, position: 'relative' }}>
                    <Sup>$</Sup>
                    <Typography
                      variant='h3'
                      sx={{
                        mb: -1.2,
                        lineHeight: 1,
                        color: 'primary.main',
                        fontSize: '3rem !important'
                      }}
                    >
                      {data.package?.price}
                    </Typography>
                    <Typography
                      sx={{
                        mb: -1.2,
                        lineHeight: 1,
                        color: 'primary.main',
                        fontSize: '1rem !important',
                        ml: 0.5
                      }}
                    >
                      USDT
                    </Typography>
                  </Box>
                  <Button
                    color='error'
                    sx={{ mt: 2 }}
                    variant='outlined'
                    onClick={() => setSubscriptionDialogOpen(true)}
                  >
                    Cancel Subscription
                  </Button>
                </Box>
              </DialogContent>
            </Dialog>
          </Card>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default UserViewLeft
