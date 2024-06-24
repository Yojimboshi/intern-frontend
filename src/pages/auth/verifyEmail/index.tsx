// src\pages\auth\verifyEmail\index.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Button } from '@mui/material';
import axiosInstance from 'src/configs/axiosConfig';

const VerifyEmail = () => {
    const router = useRouter();
    const { token } = router.query;
    const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                if (token) {
                    const response = await axiosInstance.post('/users/verify-email', { token });
                    if (response.data.success) {
                        setVerificationStatus('success');
                        setTimeout(() => {
                            router.push('/login');
                        }, 3000); // Redirect to login after 3 seconds
                    } else {
                        setVerificationStatus('error');
                    }
                }
            } catch (error) {
                console.error('Email verification failed:', error);
                setVerificationStatus('error');
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            padding={3}
        >
            {verificationStatus === 'pending' && (
                <Typography variant="h6">Verifying your email...</Typography>
            )}
            {verificationStatus === 'success' && (
                <Typography variant="h6" color="primary">Email verified successfully! Redirecting to login...</Typography>
            )}
            {verificationStatus === 'error' && (
                <Box textAlign="center">
                    <Typography variant="h6" color="error">Email verification failed.</Typography>
                    <Button variant="contained" color="primary" onClick={() => router.push('/register/complete-registration')}>
                        Try Again
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default VerifyEmail;