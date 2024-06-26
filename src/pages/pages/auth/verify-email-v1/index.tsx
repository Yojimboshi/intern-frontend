// src\pages\pages\auth\verify-email-v1\index.tsx
import { ReactNode, useState } from 'react'
import axiosInstance from 'src/configs/axiosConfig';
import Link from 'next/link'
import { Box, Typography, CircularProgress, Button, CardContent } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import Alert from '@mui/material/Alert'
import themeConfig from 'src/configs/themeConfig'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustrationsV1'


// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: 450 }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  marginLeft: theme.spacing(1),
  color: theme.palette.primary.main
}))

const VerifyEmailV1 = () => {
  // ** Hook
  const theme = useTheme()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleResendLink = async () => {
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await axiosInstance.post('/users/resend-activation-link')
      setMessage(response.data.message)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ p: theme => `${theme.spacing(15.5, 7, 9)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src='/images/logo.png' alt='logo' width='30' height='30' />
            <Typography variant='h6' sx={{ ml: 2, lineHeight: 1, fontWeight: 700, fontSize: '1.5rem !important' }}>
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 8 }}>
            <Typography variant='h5' sx={{ mb: 2 }}>
              Verify your email ✉️
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Account activation link sent to your email address: Please follow the
              link inside to continue.
            </Typography>
          </Box>
          <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ color: 'text.secondary' }}>Didn't get the mail?</Typography>
            <LinkStyled href='#' onClick={e => {
              e.preventDefault()
              handleResendLink()
            }}>
              Resend
            </LinkStyled>
          </Box>
          {loading && <CircularProgress />}
          {message && <Alert severity='success'>{message}</Alert>}
          {error && <Alert severity='error'>{error}</Alert>}
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}

VerifyEmailV1.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default VerifyEmailV1
