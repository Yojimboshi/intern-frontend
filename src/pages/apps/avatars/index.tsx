// src\pages\apps\avatars\index.tsx
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Card, CardContent, Button, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Translations from 'src/layouts/components/Translations';
import AvatarEditList from 'src/views/apps/avatars/avatarEditList';
import AvatarForm from 'src/views/apps/avatars/avatarForm';
import { Avatar } from 'src/types/apps/avatarsType';
import useAvatar from 'src/hooks/useAvatar';

const AvatarListPage = () => {
  const {
    avatars,
    loading,
    error,
    fetchAvatars,
    deleteAvatar,
    saveAvatar,
  } = useAvatar();

  const [editingAvatar, setEditingAvatar] = useState<Avatar | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAvatars();
  }, []);

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
          onSave={async (avatar) => {
            await saveAvatar(avatar);
            setShowForm(false);
            setEditingAvatar(null);
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingAvatar(null);
          }}
        />
      )}
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Card>
          <CardContent>
            <AvatarEditList
              avatars={avatars}
              onEdit={(avatar: Avatar) => {
                setEditingAvatar(avatar);
                setShowForm(true);
              }}
              onDelete={deleteAvatar}
            />
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default AvatarListPage;
