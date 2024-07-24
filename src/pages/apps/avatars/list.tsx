import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Typography, Card, CardContent,
} from '@mui/material';
import authConfig from 'src/configs/auth';
import { Avatar } from 'src/types/apps/avatarsType';
import Translations from 'src/layouts/components/Translations';
import AvatarList from 'src/views/apps/avatars/avatarList';

const AvatarListPage = () => {
  const [avatarData, setAvatarData] = useState<Avatar[]>([]);
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);

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
