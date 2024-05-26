// src\pages\register\complete-registration\index.tsx

import React from 'react';
import { useRouter } from 'next/router';
import { Button, Box, Typography } from '@mui/material';

const CompleteRegistration = () => {
    const router = useRouter();

    const handleCompleteRegistration = () => {
        // Logic to complete registration
        // e.g., submitting additional user information
        router.push('/'); // Redirect to home or another appropriate page after completion
    };

    return (
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h5">
                Complete Your Registration
            </Typography>
            <Box component="form" sx={{ mt: 1 }}>
                {/* Add form fields for completing registration */}
                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleCompleteRegistration}
                >
                    Complete Registration
                </Button>
            </Box>
        </Box>
    );
};

export default CompleteRegistration;