// src\views\apps\user\list\[userId].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axiosInstance from 'src/configs/axiosConfig'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'
import UserViewLeft from 'src/views/apps/user/list/UserViewLeft'
import WalletListTable from 'src/views/apps/user/list/WalletListTable'
import { CryptoBalance, EwalletBalance } from 'src/types/apps/walletTypes'
import { UsersType } from 'src/types/apps/userTypes'
import UsersProjectListTable from 'src/views/apps/user/list/UsersProjectListTable'

interface UserData {
  cryptoBalances: CryptoBalance[];
  eWalletProfiles: EwalletBalance[];
  userDetails: UsersType
}


// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>(({ theme }) => ({
  margin: 0,
  padding: 0,
  marginLeft: theme.spacing(0.75),
  '& .MuiTimelineItem-root': {
    '&:before': {
      display: 'none'
    },
    '&:last-child': {
      minHeight: 60
    }
  }
}))

const SelectedUserOverview = () => {
  const router = useRouter();
  const { userId } = router.query;
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (userId) {
      // Replace with your API endpoint and fetching logic
      console.log("HERE")
      axiosInstance.get(`/admin/users/id/${userId}`).then(response => {
        console.log('Fetched User Data:', response.data);
        setUserData(response.data);
      });
    }
  }, [userId]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  console.log('userDetails:', userData.userDetails);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <UserViewLeft userData={userData.userDetails} />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>

        <Grid item xs={12}>
          <Card>
            <CardHeader title='User Activity Timeline' />
            <CardContent>
              <Timeline>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color='error' />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Box
                      sx={{
                        mb: 2,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography variant='body2' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                        User login
                      </Typography>
                      <Typography variant='caption'>-- min ago</Typography>
                    </Box>
                    <Typography variant='body2'>User login at -:--pm</Typography>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color='primary' />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Box
                      sx={{
                        mb: 2,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography variant='body2' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                        ---
                      </Typography>
                      <Typography variant='caption'>-- min ago</Typography>
                    </Box>
                    <Typography variant='body2' sx={{ mb: 2 }}>
                      -- @--:--am
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar alt='Avatar' src='/images/avatars/2.png' sx={{ width: 40, height: 40, mr: 2 }} />
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                          -- (Client)
                        </Typography>
                        <Typography variant='body2'>---</Typography>
                      </Box>
                    </Box>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color='info' />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Box
                      sx={{
                        mb: 2,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography variant='body2' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                        Create a new project
                      </Typography>
                      <Typography variant='caption'>- day ago</Typography>
                    </Box>
                    <Typography variant='body2'>Add files --</Typography>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color='success' />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Box
                      sx={{
                        mb: 2,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography variant='body2' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                        Create --
                      </Typography>
                      <Typography variant='caption'>-- min ago</Typography>
                    </Box>
                    <Typography variant='body2'>Create new -- and send to --</Typography>
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 28, height: 'auto' }}>
                        <img width={28} height={28} alt='invoice.pdf' src='/images/icons/file-icons/pdf.png' />
                      </Box>
                      <Typography variant='subtitle2' sx={{ ml: 2, fontWeight: 600 }}>
                        --.pdf
                      </Typography>
                    </Box>
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <WalletListTable
            cryptoBalances={userData.cryptoBalances}
            eWalletProfiles={userData.eWalletProfiles} />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default SelectedUserOverview
