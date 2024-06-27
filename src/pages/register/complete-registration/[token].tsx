// src\pages\register\complete-registration\[token].tsx
import { useRouter } from 'next/router';
import { useEffect, useState, ReactNode } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import BlankLayout from 'src/@core/layouts/BlankLayout';
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2';
import axiosInstance from 'src/configs/axiosConfig';
import themeConfig from 'src/configs/themeConfig';

const ActivateEmail = () => {
  const router = useRouter();
  const { token } = router.query;
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log('Token:', token);  // Log the token for debugging
    if (token) {
      axiosInstance.get(`/users/activate/${token}`)
        .then(response => {
          console.log('Activation Response:', response.data);  // Log the response
          setMessage('Account activated successfully. You can now log in.');
        })
        .catch(error => {
          console.error('Activation Error:', error.response || error.message);  // Log the error
          setMessage('Invalid or expired activation token');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [token]);

  return (
    <>
      <Head>
        <title>{`${themeConfig.templateName} - Account Activation`}</title>
      </Head>
      <BlankLayout>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center',
            p: 3,
          }}
        >
          <Typography variant="h4" sx={{ mb: 2 }}>
            Email Verification
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <Alert severity={message.includes('successfully') ? 'success' : 'error'}>
              {message}
            </Alert>
          )}
        </Box>
        <FooterIllustrationsV2 />
      </BlankLayout>
    </>
  );
};

ActivateEmail.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;
ActivateEmail.authGuard = false; // Ensure AuthGuard is not used

export default ActivateEmail;
