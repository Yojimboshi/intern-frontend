// src\views\dashboards\analytics\AnalyticsCongratulations.tsx
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid, { GridProps } from '@mui/material/Grid'
import { styled, useTheme } from '@mui/material/styles'
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';

// Styled Grid component
const StyledGrid = styled(Grid)<GridProps>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    order: -1,
    display: 'flex',
    justifyContent: 'center'
  }
}))

// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  right: 0,
  bottom: 0,
  width: 298,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    width: 250,
    position: 'static'
  }
}))

const AnalyticsCongratulations = () => {
  // ** Hook
  const theme = useTheme()
  const [username, setUsername] = useState('John');
  const { t } = useTranslation();

  useEffect(() => {
    // Retrieve userData from localStorage
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      const userData = JSON.parse(storedData);

      // If username exists in userData, update the state
      if (userData.username) {
        setUsername(userData.username);
      }
    }
  }, []);

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent sx={{ p: theme => `${theme.spacing(6.75, 7.5)} !important` }}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <Typography variant='h5' sx={{ mb: 4.5 }}>
              {t('Congratulations')}
              <Box component='span' sx={{ fontWeight: 'bold' }}>
                {username}  {/* Use the username from state here */}
              </Box>
              ! 🎉
            </Typography>
            <Typography variant='body2'>
              {t('You have done')}
              <Box component='span' sx={{ fontWeight: 600 }}>
                %
              </Box>{' '}
              😎 {t('more today.')} {/* Translated text */}
            </Typography>
            <Typography sx={{ mb: 4.5 }} variant='body2'>
              {t('Check your new badge in your profile.')}
            </Typography>
            <Link href={'/apps/user/view/overview/'} passHref>
              <Button variant='contained' component="a">{t('View Profile')}</Button>
            </Link>
          </Grid>
          <StyledGrid item xs={12} sm={6}>
            <Img alt='Congratulations John' src={`/images/cards/illustration-john-${theme.palette.mode}.png`} />
          </StyledGrid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AnalyticsCongratulations
