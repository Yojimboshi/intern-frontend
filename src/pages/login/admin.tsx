// src\pages\login\admin.tsx
import { ReactNode, useState, MouseEvent } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import Translations from 'src/layouts/components/Translations';
import useBgColor from 'src/@core/hooks/useBgColor'
import { useAuth } from 'src/hooks/useAuth'
import Icon from 'src/@core/components/icon'
import { useSettings } from 'src/@core/hooks/useSettings'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import themeConfig from 'src/configs/themeConfig'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import LanguageDropdown from 'src/@core/layouts/components/shared-components/LanguageDropdown'
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustrationsV1'


// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: 450 }
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(5).required()
})

const defaultValues = {
  password: '11111',
  email: 'xxx@qq.com'
}

interface FormData {
  email: string
  password: string
}

const AdminLogin = () => {
  const [rememberMe, setRememberMe] = useState<boolean>(true)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  // ** Hook
  const theme = useTheme()
  const auth = useAuth()
  const bgColors = useBgColor()
  const { settings, saveSettings } = useSettings()

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: FormData) => {
    const { email, password } = data
    auth.login({ email, password, rememberMe }, () => {
      setError('email', {
        type: 'manual',
        message: 'Email or Password is invalid'
      })
    })
  }


  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ p: theme => `${theme.spacing(13, 7, 6.5)} !important` }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-start', width: '100%' }}>
            <LanguageDropdown settings={settings} saveSettings={saveSettings} />
            <ModeToggler settings={settings} saveSettings={saveSettings} />
          </Box>
          <Box sx={{ mb: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant='h5' sx={{ mb: 1.5, fontWeight: 600, letterSpacing: '0.18px' }}>
              <a href="/login">
                <span role="img" aria-label="hand">👋🏻</span>
              </a>
              <Translations text='Welcome to' />
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img src='/images/logo.png' alt='logo' width='30' height='30' />
              <Typography variant='h6' sx={{ ml: 2, lineHeight: 1, fontWeight: 700, fontSize: '1.5rem !important' }}>
                {themeConfig.templateName}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='body2'>
              <Translations text='Please sign-in to your account and start the adventure' />
            </Typography>
          </Box>


          <Alert icon={false} sx={{ py: 3, mb: 6, ...bgColors.primaryLight, '& .MuiAlert-message': { p: 0 } }}>
            <Typography variant='caption' sx={{ mb: 2, display: 'block', color: 'primary.main' }}>
              <Translations text="Admin: " />
              <strong>xxx@qq.com</strong>
              <Translations text="/ Pass: " />
              <strong>11111</strong>
            </Typography>
          </Alert>

          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    autoFocus
                    label='Email'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.email)}
                    placeholder='admin@materialize.com'
                  />
                )}
              />
              {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                <Translations text='Password' />
              </InputLabel>
              <Controller
                name='password'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <OutlinedInput
                    value={value}
                    onBlur={onBlur}
                    label='Password'
                    onChange={onChange}
                    id='auth-login-v2-password'
                    error={Boolean(errors.password)}
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                )}
              />
              {errors.password && (
                <FormHelperText sx={{ color: 'error.main' }} id=''>
                  {errors.password.message}
                </FormHelperText>
              )}
            </FormControl>
            <Box
              sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
            >
              <FormControlLabel
                label='Remember Me'
                control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
              />
              <Typography
                variant='body2'
                component={Link}
                href='/forgot-password'
                sx={{ color: 'primary.main', textDecoration: 'none' }}
              >
                <Translations text='Forgot Password?' />
              </Typography>
            </Box>
            <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }}>
              <Translations text='Login' />
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography sx={{ mr: 2, color: 'text.secondary' }}>
                <Translations text='New on our platform?' />
              </Typography>
              <Typography href='/register' component={Link} sx={{ color: 'primary.main', textDecoration: 'none' }}>
                <Translations text='Create an account' />
              </Typography>
            </Box>
            <Divider
              sx={{
                '& .MuiDivider-wrapper': { px: 4 },
                mt: theme => `${theme.spacing(5)} !important`,
                mb: theme => `${theme.spacing(7.5)} !important`
              }}
            >
              or
            </Divider>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconButton
                href='/'
                component={Link}
                sx={{ color: '#497ce2' }}
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              >
                <Icon icon='mdi:facebook' />
              </IconButton>
              <IconButton
                href='/'
                component={Link}
                sx={{ color: '#1da1f2' }}
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              >
                <Icon icon='mdi:twitter' />
              </IconButton>
              <IconButton
                href='/'
                component={Link}
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                sx={{ color: theme => (theme.palette.mode === 'light' ? '#272727' : 'grey.300') }}
              >
                <Icon icon='mdi:github' />
              </IconButton>
              <IconButton
                href='/'
                component={Link}
                sx={{ color: '#db4437' }}
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              >
                <Icon icon='mdi:google' />
              </IconButton>
            </Box>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}

AdminLogin.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

AdminLogin.guestGuard = false

export default AdminLogin
