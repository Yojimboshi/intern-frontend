import { useState, SyntheticEvent, Fragment, ReactNode } from 'react'
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { styled, Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import Typography, { TypographyProps } from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Icon from 'src/@core/components/icon'
import PerfectScrollbarComponent from 'react-perfect-scrollbar'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import { useRouter } from 'next/router'

import useAnnouncements from 'src/hooks/useAnnounce'
import { Settings } from 'src/@core/context/settingsContext'
import { NotificationsAction, NotificationsType } from 'src/types/apps/announcementTypes'

interface Props {
  settings: Settings
  notifications: NotificationsType[] // Added this line
}

const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 380,
    overflow: 'hidden',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0
  }
}))

const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  maxHeight: 344
})

const Avatar = styled(CustomAvatar)({
  width: 38,
  height: 38,
  fontSize: '1.125rem'
})

const MenuItemTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  flex: '1 1 100%',
  overflow: 'hidden',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  marginBottom: theme.spacing(0.75)
}))

const MenuItemSubtitle = styled(Typography)<TypographyProps>({
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <Box sx={{ maxHeight: 349, overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
  }
}

const NotificationDropdown = (props: Props) => {
  const { settings, notifications } = props // Destructure notifications here
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<NotificationsType | null>(null)
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
  const { direction } = settings
  const router = useRouter()
  const { markAsSeen, likeAnnouncement, claimAnnouncement } = useAnnouncements();


  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  const readAllNotif = () => {
    router.push({
      pathname: `/apps/user/view/notification`
    })
    setAnchorEl(null)
  }

  const handleDialogOpen = (notification: NotificationsType) => {
    setSelectedNotification(notification)
    setOpenDialog(true)
    markAsSeen(notification.id)
  }

  const handleDialogClose = () => {
    setOpenDialog(false)
    setSelectedNotification(null)
  }

  const handleLike = async () => {
    if (selectedNotification) {
      await likeAnnouncement(selectedNotification.id)
      setOpenDialog(false)
    }
  }

  const handleClaimRewards = async () => {
    if (selectedNotification) {
      await claimAnnouncement(selectedNotification.id)
      setOpenDialog(false)
    }
  }

  const RenderAvatar = ({ notification }: { notification: NotificationsAction }) => {
    const { avatarAlt, avatarImg, avatarIcon, avatarText, avatarColor } = notification

    if (avatarImg) {
      return <Avatar alt={avatarAlt} src={avatarImg} />
    } else if (avatarIcon) {
      return (
        <Avatar skin='light' color={avatarColor}>
          {avatarIcon}
        </Avatar>
      )
    } else {
      return (
        <Avatar skin='light' color={avatarColor}>
          {getInitials(avatarText as string)}
        </Avatar>
      )
    }
  }

  return (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
        <Badge
          color='error'
          variant='dot'
          invisible={!notifications.length}
          sx={{
            '& .MuiBadge-badge': { top: 4, right: 4, boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}` }
          }}
        >
          <Icon icon='mdi:bell-outline' />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{ cursor: 'default', userSelect: 'auto', backgroundColor: 'transparent !important' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography sx={{ cursor: 'text', fontWeight: 600 }}>Notifications</Typography>
            <CustomChip
              skin='light'
              size='small'
              color='primary'
              label={`${notifications.length} New`}
              sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500, borderRadius: '10px' }}
            />
          </Box>
        </MenuItem>
        <ScrollWrapper hidden={hidden}>
          {notifications.map((notification: NotificationsType, index: number) => (
            <MenuItem key={index} onClick={() => handleDialogOpen(notification)}>
              <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                <RenderAvatar notification={notification} />
                <Box sx={{ mx: 4, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
                  <MenuItemTitle>{notification.title}</MenuItemTitle>
                  <MenuItemSubtitle variant='body2'>{notification.subtitle}</MenuItemSubtitle>
                  {notification.rewards && <MenuItemSubtitle variant='body2'>Rewards: {notification.rewards}</MenuItemSubtitle>}
                </Box>
                <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                  {notification.meta}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </ScrollWrapper>
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{
            py: 3.5,
            borderBottom: 0,
            cursor: 'default',
            userSelect: 'auto',
            backgroundColor: 'transparent !important',
            borderTop: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Button fullWidth variant='contained' onClick={readAllNotif}>
            Read All Notifications
          </Button>
        </MenuItem>
      </Menu>
      {selectedNotification && (
        <Dialog open={openDialog} onClose={handleDialogClose} aria-labelledby="notification-dialog-title">
          <DialogTitle id="notification-dialog-title">{selectedNotification.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{selectedNotification.subtitle}</DialogContentText>
            {selectedNotification.rewards && (
              <DialogContentText>Rewards: {selectedNotification.rewards}</DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleLike} color="primary">
              Like
            </Button>

            {selectedNotification.rewards && (
              <Button onClick={handleClaimRewards} color="primary">
                Claim Rewards
              </Button>
            )}
            <Button onClick={handleDialogClose} color="primary" autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Fragment>
  )
}

export default NotificationDropdown
