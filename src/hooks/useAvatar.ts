// src/hooks/useAvatar.ts
import { useState } from 'react';
import axios from 'src/configs/axiosConfig';
import { Avatar } from 'src/types/apps/avatarsType';

const USER_URL = '/avatars';

const useAvatar = () => {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvatars = async () => {
    setLoading(true);
    console.log("Fetching avatars");

    try {
      const response = await axios.get(`/avatars/all`);
      setAvatars(response.data.data || []); // Ensure data is an array
      console.log("Fetched avatars:", response.data);
    } catch (error) {
      console.error("Error fetching avatars:", error);
      setError("Error fetching avatars");
    } finally {
      setLoading(false);
    }
  };

  const deleteAvatar = async (id: number) => {
    try {
      console.log("Deleting avatar:", id);
      await axios.delete(`/avatars/${id}`);
      console.log("Deleted successfully");

      await fetchAvatars(); // Refresh avatar data after deletion
    } catch (error) {
      console.error('Error deleting avatar:', error);
    }
  };

  const saveAvatar = async (avatar: Avatar) => {
    try {
      if (avatar.id) {
        console.log("Updating avatar:", avatar);
        await axios.put(
          `/avatars/${avatar.id}`,
          {
            image: avatar.image,
            level: avatar.level,
          }
        );
      } else {
        console.log("Creating new avatar");
        await axios.post(
          `/avatars`,
          {
            image: avatar.image,
            level: avatar.level,
          }
        );
      }

      await fetchAvatars(); // Refresh avatar data after saving
      console.log("Success");
    } catch (error) {
      console.error('Error saving avatar:', error);
    }
  };

  return {
    avatars,
    loading,
    error,
    fetchAvatars,
    deleteAvatar,
    saveAvatar,
  };
};

export default useAvatar;
