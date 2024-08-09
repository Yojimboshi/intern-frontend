// src/hooks/useUserNames.ts
import { useState, useCallback } from 'react';
import axios from 'src/configs/axiosConfig';

type UserNameType = {
  userId: number;
  name: string;
};

const useUserNames = () => {
  const [userNames, setUserNames] = useState<UserNameType[]>([]);

  const fetchUserName = useCallback(async (userId: number) => {
    try {
      // Check if the name is already in the state to avoid redundant API calls
      const existingUser = userNames.find((user) => user.userId === userId);
      if (existingUser) {
        return existingUser.name;
      }

      // Fetch the user's name from the API
      const response = await axios.get(`/chats/senderId/names/${userId}`);
      const userName = response.data.name;

      // Store the fetched name in the state
      setUserNames((prev) => [...prev, { userId, name: userName }]);

      return userName;
    } catch (error) {
      console.error(`Error fetching user name for userId ${userId}:`, error);

      return null;
    }
  }, [userNames]);

  return { fetchUserName };
};

export default useUserNames;
