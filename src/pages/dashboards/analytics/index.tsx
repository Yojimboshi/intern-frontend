import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Icon from 'src/@core/components/icon'
import CardStatisticsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import AnalyticsSessions from 'src/views/dashboards/analytics/AnalyticsSessions'
import AnalyticsPerformance from 'src/views/dashboards/analytics/AnalyticsPerformance'
import AnalyticsVisitsByDay from 'src/views/dashboards/analytics/AnalyticsVisitsByDay'
import AnalyticsCongratulations from 'src/views/dashboards/analytics/AnalyticsCongratulations'
import AnalyticsActivityTimeline from 'src/views/dashboards/analytics/AnalyticsActivityTimeline'
import AnalyticsTotalTransactions from 'src/views/dashboards/analytics/AnalyticsTotalTransactions'
import useAnnouncements from 'src/hooks/useAnnounce'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

interface AnnouncementDetails {
  title: string
  message: string
  rewards: string
  [key: string]: any
}

const AnalyticsDashboard = () => {
  const { todayAnnouncement, likeAnnouncement, claimAnnouncement } = useAnnouncements()
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [announcementDetails, setAnnouncementDetails] = useState<AnnouncementDetails>({
    title: '',
    message: '',
    rewards: ''
  })

  useEffect(() => {
    if (todayAnnouncement) {
      setOpenSnackbar(true)
      setAnnouncementDetails({
        title: todayAnnouncement.title,
        message: todayAnnouncement.subtitle,
        rewards: todayAnnouncement.rewards
      })
    }
  }, [todayAnnouncement])

  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbar(false)
  }

  const handleSnackbarClick = () => {
    setOpenDialog(true)
  }

  const handleDialogClose = () => {
    setOpenDialog(false)
  }

  const handleLike = async () => {
    if (todayAnnouncement) {
      await likeAnnouncement(todayAnnouncement.id)
      setOpenDialog(false)
    }
  }

  const handleClaimRewards = async () => {
    if (todayAnnouncement) {
      await claimAnnouncement(todayAnnouncement.id)
      setOpenDialog(false)
    }
  }

  return (
    <ApexChartWrapper>
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12} md={8}>
          <AnalyticsCongratulations />
        </Grid>
        <Grid item xs={6} md={2}>
          <CardStatisticsVertical
            stats='---'
            color='primary'
            trendNumber='+22%'
            title='Total'
            chipText='---'
            icon={<Icon icon='mdi:cart-plus' />}
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <AnalyticsSessions />
        </Grid>
        <Grid item xs={12} md={8}>
          <AnalyticsTotalTransactions />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <AnalyticsPerformance />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <AnalyticsVisitsByDay />
        </Grid>
        <Grid item xs={12} md={8}>
          <AnalyticsActivityTimeline />
        </Grid>
      </Grid>
      <Snackbar open={openSnackbar} autoHideDuration={1000} onClose={handleSnackbarClose} onClick={handleSnackbarClick}>
        <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
          {todayAnnouncement ? todayAnnouncement.title : 'No announcements for today.'}
        </Alert>
      </Snackbar>
      <Dialog open={openDialog} onClose={handleDialogClose} aria-labelledby="announcement-dialog-title">
        <DialogTitle id="announcement-dialog-title">Today's Announcement</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {announcementDetails.title}
          </DialogContentText>
          <DialogContentText>
            {announcementDetails.message}
          </DialogContentText>
          <DialogContentText>
            Rewards: {announcementDetails.rewards}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLike} color="primary">
            Like
          </Button>
          <Button onClick={handleClaimRewards} color="primary">
            Claim Rewards
          </Button>
        </DialogActions>
      </Dialog>
    </ApexChartWrapper>
  )
}

export default AnalyticsDashboard
