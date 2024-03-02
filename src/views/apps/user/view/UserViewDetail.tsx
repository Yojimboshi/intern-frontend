// src\views\apps\user\view\UserViewDetail.tsx
import { useState } from 'react'
import { useDispatch } from 'react-redux';
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'
import { UsersType } from 'src/types/apps/userTypes'
import { updateUser } from 'src/store/apps/user/index'


interface UserViewDetailProps {
  userData: UsersType; // Mandatory because it will always be passed in this context
  handleClose: () => void; // Mandatory for the same reason
}


const UserViewDetail = ({ userData, handleClose }: UserViewDetailProps) => {
  console.log("UserViewDetail rendering...")
  const dispatch = useDispatch();
  const [data, setData] = useState<UsersType>({ ...userData });

  const handleSubmit = async () => {
    console.log("handleSubmit started"); // Log when the function starts

    const formData = { ...data };
    console.log("Form data to submit:", formData); // Log the form data to be submitted
    try {
      await dispatch(updateUser(formData) as any);
      console.log("Dispatch successful"); // Log after dispatch is successful
    } catch (error) {
      console.error("Dispatch failed:", error); // Log if dispatch fails
    }
    handleClose(); // Close the dialog after dispatch

  };

  // Handlers for the controlled components
  const handleChange = (propName: keyof UsersType, newValue: any) => {
    setData({ ...data, [propName]: newValue });
  };

  return (
    <Dialog
      open={true}
      onClose={handleClose}
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
              <TextField
                fullWidth
                label='First Name'
                value={data.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Last Name'
                value={data.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Username'
                value={data.username}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type='email'
                label='Email'
                value={data.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='user-view-status-label'>Status</InputLabel>
                <Select
                  label='Status'
                  value={data.accountStatus || ''} // Use value from state
                  onChange={(e) => setData({ ...data, accountStatus: e.target.value })} // Update the state on change
                  id='user-view-status'
                  labelId='user-view-status-label'
                >
                  <MenuItem value='active'>Active</MenuItem>
                  <MenuItem value='restrict'>Restrict</MenuItem>
                  <MenuItem value='ban'>Ban</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Role'
                value={data.role}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Contact'
                value={data.contact}
                onChange={(e) => handleChange('contact', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Current Plan'
                value={userData.packageId}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Withdrawn # Today'
                value={userData.withdrawalRequestsToday} // Assuming withdrawalRequestsToday is a number
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Is Empty'
                value={userData.isEmpty ? 'Yes' : 'No'}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                label='Checked?'
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
        <Button variant='contained' sx={{ mr: 2 }} onClick={handleSubmit}>
          Submit
        </Button>
        <Button variant='outlined' color='secondary' onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>

  )
}

export default UserViewDetail
