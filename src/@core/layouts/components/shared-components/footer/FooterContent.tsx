// src\@core\layouts\components\shared-components\footer\FooterContent.tsx
import { useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Theme } from '@mui/material/styles'
import { styled } from '@mui/material/styles'

// Custom components or utilities
import Icon from 'src/@core/components/icon'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const iconList = [
  "bi:fire",
  "carbon:fire",
  "uil:fire",
  "ant-design:fire-filled",
];

const FooterContent = () => {
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  const handleSupportClick = () => {
    setOpenDialog(true);
  };

  // Function to handle dialog closing
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleIconClick = () => {
    setCurrentIconIndex((prevIndex) => (prevIndex + 1) % iconList.length);
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
        <IconButton onClick={handleIconClick}>
          <Icon icon={iconList[currentIconIndex]} />
        </IconButton>
        {` by `}
        <Box component='span' sx={{ color: 'error.main' }}>
          <Icon icon="game-icons:swan" />
        </Box>

      </Typography>
      {hidden ? null : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& :not(:last-child)': { mr: 4 } }}>
          <LinkStyled href='#' onClick={handleSupportClick}>
            Support
          </LinkStyled>
        </Box>
      )}

      {/* Dialog Component */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Support</DialogTitle>
        <DialogContent>
          <DialogContentText>
            If you need help, please email us at: <a href="mailto:helpdesk@blackswandapp.com">helpdesk@blackswandapp.com</a>
            <br />
            Visit our website: <a href="https://blackswandapp.com" target="_blank" rel="noopener noreferrer">blackswandapp.com</a>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default FooterContent
