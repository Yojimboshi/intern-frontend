import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Typography, Card, CardContent, Button
} from '@mui/material';
import authConfig from 'src/configs/auth';
import { Avatar } from 'src/types/apps/avatarsType';
import Translations from 'src/layouts/components/Translations';
import AvatarEditList from 'src/views/apps/avatars/avatarEditList';
import AvatarForm from 'src/views/apps/avatars/avatarForm';
import AddIcon from '@mui/icons-material/Add';

const AvatarListPage = () => {
  const [avatarData, setAvatarData] = useState<Avatar[]>([]);
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);
  const [editingAvatar, setEditingAvatar] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAvatars();
  }, []);

  const fetchAvatars = async () => {
    console.log("Fetching avatars");

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/avatars/all`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      const imageData = response.data;
      console.log("Fetched avatars:", imageData);
      setAvatarData(imageData.data || []); // Ensure data is an array

    } catch (error) {
      console.error("Error fetching avatars:", error);
    }
  };

  const handleDeleteAvatar = async (id: number) => {
    try {
      console.log("Deleting avatar:", id);
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/avatars/${id}`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      });
      console.log("Deleted successfully");
      fetchAvatars();
    } catch (error) {
      console.error('Error deleting avatar:', error);
    }
  };


  const handleSaveAvatar = async (avatar: Avatar) => {
    try {
      if (avatar.id) {
        console.log("Updating avatar:", avatar);
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/avatars/${avatar.id}`,
          {
            image: avatar.image,
            level: avatar.level,
          },
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
      } else {
        console.log("Creating new avatar");
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/avatars`,
          {
            image: avatar.image,
            level: avatar.level,
          },
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
      }
      fetchAvatars();
      setShowForm(false);
      setEditingAvatar(null);
    } catch (error) {
      console.error('Error saving avatar:', error);
    }
  };



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
            onEdit={(avatar: React.SetStateAction<null>) => {
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
