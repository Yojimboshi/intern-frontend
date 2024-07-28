// src/views/apps/avatars/list.tsx
import React, { useEffect } from 'react';
import {
  Container, Typography, Card, CardContent, Alert
} from '@mui/material';
import Translations from 'src/layouts/components/Translations';
import AvatarList from 'src/views/apps/avatars/avatarList';
import useAvatar from 'src/hooks/useAvatar';

const AvatarListPage = () => {
  const { avatars, loading, error, fetchAvatars } = useAvatar();

  useEffect(() => {
    fetchAvatars();
  }, []);

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        <Translations text="Avatars" />
      </Typography>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Card>
          <CardContent>
            <AvatarList avatars={avatars} />
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default AvatarListPage;
