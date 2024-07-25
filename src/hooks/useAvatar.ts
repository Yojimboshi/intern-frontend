// src/hooks/fetchAvatars.tsx
import { useState, useEffect } from 'react';
import authConfig from 'src/configs/auth';
import { Avatar } from 'src/types/apps/avatarsType';

export const useFetchAvatars = (setAvatarData: React.Dispatch<React.SetStateAction<Avatar[]>>) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvatarsData = async () => {
      setLoading(true);
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);
      console.log("Fetching avatars");

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/avatars/all`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const imageData = await response.json();
        console.log("Fetched avatars:", imageData);
        setAvatarData(imageData.data || []); // Ensure data is an array

      } catch (error) {
        console.error("Error fetching avatars:", error);
        setError("Error fetching avatars");
      } finally {
        setLoading(false);
      }
    };

    fetchAvatarsData();
  }, [setAvatarData]);

  return { loading, error };
};

const deleteAvatar = async (id: number, setAvatarData: React.Dispatch<React.SetStateAction<Avatar[]>>) => {
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);

  try {
    console.log("Deleting avatar:", id);
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/avatars/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${storedToken}` },
    });
    console.log("Deleted successfully");

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/avatars/all`, {
      headers: { Authorization: `Bearer ${storedToken}` },
    });
    const imageData = await response.json();
    setAvatarData(imageData.data || []);
  } catch (error) {
    console.error('Error deleting avatar:', error);
  }
};

const saveAvatar = async (avatar: Avatar, setAvatarData: React.Dispatch<React.SetStateAction<Avatar[]>>) => {
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);

  try {
    if (avatar.id) {
      console.log("Updating avatar:", avatar);
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/avatars/${avatar.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          image: avatar.image,
          level: avatar.level,
        }),
      });
    } else {
      console.log("Creating new avatar");
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/avatars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          image: avatar.image,
          level: avatar.level,
        }),
      });
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/avatars/all`, {
      headers: { Authorization: `Bearer ${storedToken}` },
    });
    console.log("Success")
    const imageData = await response.json();
    setAvatarData(imageData.data || []);
  } catch (error) {
    console.error('Error saving avatar:', error);
  }
};

export const useAvatarActions = (setAvatarData: React.Dispatch<React.SetStateAction<Avatar[]>>) => {
  return {
    handleDeleteAvatar: (id: number) => deleteAvatar(id, setAvatarData),
    handleSaveAvatar: (avatar: Avatar) => saveAvatar(avatar, setAvatarData),
  };
};
