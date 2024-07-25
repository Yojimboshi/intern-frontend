// src/views/apps/avatars/AvatarListPage.tsx
import React, { useState } from 'react';
import {
  Container, Typography, Card, CardContent,
} from '@mui/material';
import Translations from 'src/layouts/components/Translations';
import AvatarList from 'src/views/apps/avatars/avatarList';
import { Avatar } from 'src/types/apps/avatarsType';
import { useFetchAvatars } from 'src/hooks/useAvatar';

const AvatarListPage = () => {
  const [avatarData, setAvatarData] = useState<Avatar[]>([]);
  const { loading, error } = useFetchAvatars(setAvatarData);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        <Translations text="Avatars" />
      </Typography>

      <Card>
        <CardContent>
          <AvatarList avatars={avatarData} />
        </CardContent>
      </Card>
    </Container>
  );
};

export default AvatarListPage;
