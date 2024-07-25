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

export const useMarkAsSeen = () => {
  const [seenAnnouncements, setSeenAnnouncements] = useState<number[]>([]);
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);

  const markAsSeen = async (announcementId: number) => {
    if (!seenAnnouncements.includes(announcementId)) {
      setSeenAnnouncements((prev) => [...prev, announcementId]);

      try {
        const userId = await getUserId();
        if (userId === null) {
          console.error('User is not logged in');

          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/announcements/seen`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`
          },
          body: JSON.stringify({ userId, announcementId })
        });

        if (!response.ok) {
          console.error('Failed to mark the notification as seen');
        }
      } catch (error) {
        console.error('Error marking the notification as seen', error);
      }
    }
  };

  return { seenAnnouncements, markAsSeen };
};

export const useDeleteAnnouncement = () => {
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);

  const deleteAnnouncement = async (id: number) => {
    try {
      console.log('Deleting announcement:', id);
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/announcements/${id}`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      });
      console.log('Deleted successfully');
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  return deleteAnnouncement;
};

export const useSaveAnnouncement = () => {
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);

  const saveAnnouncement = async (announcement: {
    id: number | null;
    content: string;
    title: string;
    subtitle: string;
    rewards: string;
  }) => {
    try {
      if (announcement.id) {
        console.log('Updating announcement:', announcement);
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/announcements/${announcement.id}`,
          {
            message: announcement.content,
            title: announcement.title,
            subtitle: announcement.subtitle,
            rewards: announcement.rewards,
          },
          {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          }
        );
      } else {
        console.log('Creating new announcement');
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/announcements`,
          {
            message: announcement.content,
            title: announcement.title,
            subtitle: announcement.subtitle,
            rewards: announcement.rewards,
          },
          {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          }
        );
      }
    } catch (error) {
      console.error('Error saving announcement:', error);
    }
  };

  return saveAnnouncement;
};
export const useLikeAnnouncement = () => {
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);

  const likeAnnouncement = async (announcementId: number) => {
    const userId = await getUserId();
    if (userId) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/announcements/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`
          },
          body: JSON.stringify({ userId, announcementId })
        });

        if (!response.ok) {
          console.error('Failed to like the notification');
        }
      } catch (error) {
        console.error('Error liking the notification', error);
      }
    }
  };

  return likeAnnouncement;
};

export const useClaimAnnouncement = () => {
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);

  const claimAnnouncement = async (announcementId: number) => {
    const userId = await getUserId();
    if (userId) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/announcements/claim-rewards`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`
          },
          body: JSON.stringify({ userId, announcementId })
        });

        if (!response.ok) {
          console.error('Failed to claim rewards');
        }
      } catch (error) {
        console.error('Error claiming rewards', error);
      }
    }
  };

  return claimAnnouncement;
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
