// src/hooks/useAnnounce.ts
import { useState, useEffect } from 'react'
import axios from 'axios'
import authConfig from 'src/configs/auth'

// Define the type for the announcements
interface AnnouncementType {
  id: number
  meta: string
  avatarAlt: string
  avatarImg: string
  title: string
  subtitle: string
  rewards: string
}


const getUserId = async (): Promise<number | null> => {
  const userEndpoint = authConfig.meEndpoint;
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);

  try {
    const response = await axios.get(userEndpoint, {
      headers: { Authorization: `Bearer ${storedToken}` }
    });

    const userData = response.data;
    const userId = userData.id;

    return userId;
  } catch (error) {
    console.error('Error fetching user ID:', error);

    return null;
  }
}

export const useAnnounce = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const userId = await getUserId();
      console.log(userId)
      if (userId === null) {
        console.error('User is not logged in');

        return;
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/announcements/user/${userId}`);
        setAnnouncements(response.data);

        console.log("Announcement data", response.data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  return announcements;
};


export const useTodayAnnounce = () => {

  const [todayAnnouncement, setTodayAnnouncement] = useState<AnnouncementType | null>(null)

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/announcements`)
        const data: AnnouncementType[] = await response.json()

        const today = new Date().toISOString().split('T')[0]
        const todayAnnouncement = data.find(announcement => announcement.meta === today)
        setTodayAnnouncement(todayAnnouncement || null)
      } catch (error) {
        console.error('Error fetching announcements:', error)
      }
    }

    fetchAnnouncements()
  }, [])

  return { todayAnnouncement }
}
