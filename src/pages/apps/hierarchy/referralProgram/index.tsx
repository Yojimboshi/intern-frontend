// src\pages\apps\hierarchy\referralProgram\index.tsx
import React, { useState, useEffect } from 'react';
import {
    Box, Button, Typography, TextField,
    Card, CardContent, CardHeader, Tooltip, IconButton, Snackbar
} from '@mui/material';
import { useSelector } from 'react-redux';
import QRCode from 'qrcode.react';
import { RootState } from 'src/store'; // Adjust the import based on your project structure
import Icon from 'src/@core/components/icon';

const ReferralProgram = () => {
    const [user, setUser] = useState<any>(null); // Use any type for simplicity
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [referralLink, setReferralLink] = useState<string>('');

    useEffect(() => {
        const userData = window.localStorage.getItem('userData');
        if (userData) {
            const parsedUserData = JSON.parse(userData);
            setUser(parsedUserData);
            setReferralLink(`${window.location.origin}/register?referralId=${parsedUserData.referralId}`);
        }
    }, []);

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setSnackbarOpen(true); // Open the snackbar on success
            })
            .catch((err) => {
                console.error('Could not copy text: ', err);
            });
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Card>
            <CardHeader
                title="Referral Program"
                action={
                    <Tooltip title="Copy Referral Link">
                        <IconButton color="primary" onClick={() => handleCopyToClipboard(referralLink)}>
                            <Icon icon="mdi:content-copy" />
                        </IconButton>
                    </Tooltip>
                }
            />
            <CardContent>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Share your referral link with friends and earn rewards!
                </Typography>
                <TextField
                    fullWidth
                    value={referralLink}
                    InputProps={{
                        readOnly: true,
                    }}
                    sx={{ mb: 2 }}
                />
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Or scan the QR code below to share the referral link:
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <QRCode value={referralLink} />
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleCopyToClipboard(referralLink)}
                >
                    Copy Referral Link
                </Button>
            </CardContent>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message="Referral link copied to clipboard"
            />
        </Card>
    );
};

export default ReferralProgram;