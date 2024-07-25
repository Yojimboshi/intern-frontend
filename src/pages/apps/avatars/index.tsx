import React, { useState } from 'react';
import {
  Container, Typography, Card, CardContent, Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Translations from 'src/layouts/components/Translations';
import AvatarEditList from 'src/views/apps/avatars/avatarEditList';
import AvatarForm from 'src/views/apps/avatars/avatarForm';
import { Avatar } from 'src/types/apps/avatarsType';
import { useFetchAvatars, useAvatarActions } from 'src/hooks/useAvatar';

const AvatarListPage = () => {
  const [avatarData, setAvatarData] = useState<Avatar[]>([]);
  const { loading, error } = useFetchAvatars(setAvatarData);
  const { handleDeleteAvatar, handleSaveAvatar } = useAvatarActions(setAvatarData);
  const [editingAvatar, setEditingAvatar] = useState<Avatar | null>(null);
  const [showForm, setShowForm] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        <Translations text="Avatars Editor" />
      </Typography>
      <Button onClick={() => setShowForm(true)} startIcon={<AddIcon />}>
        Add Avatar
      </Button>
      {showForm && (
        <AvatarForm
          avatar={editingAvatar}
          onSave={handleSaveAvatar}
          onCancel={() => {
            setShowForm(false);
            setEditingAvatar(null);
          }}
        />
      )}
      <Card>
        <CardContent>
          <AvatarEditList
            avatars={avatarData}
            onEdit={(avatar: Avatar) => {
              setEditingAvatar(avatar);
              setShowForm(true);
            }}
            onDelete={handleDeleteAvatar} />
        </CardContent>
      </Card>
    </Container>
  );
};

export default AvatarListPage;
