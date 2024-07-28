// src/hooks/useAnnounce.ts
import { useState, useEffect } from 'react';
import axios from 'src/configs/axiosConfig';

interface AnnouncementType {
  id: number;
  meta: string;
  avatarAlt: string;
  avatarImg: string;
  title: string;
  subtitle: string;
  rewards: string;
}

const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);
  const [seenAnnouncements, setSeenAnnouncements] = useState<number[]>([]);
  const [todayAnnouncement, setTodayAnnouncement] = useState<AnnouncementType | null>(null);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`/announcements`);
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const markAsSeen = async (announcementId: number) => {
    if (!seenAnnouncements.includes(announcementId)) {
      setSeenAnnouncements((prev) => [...prev, announcementId]);

      try {
        const response = await axios.post(`/announcements/seen`, { announcementId });
        if (!response.status) {
          console.error('Failed to mark the notification as seen');
        }
      } catch (error) {
        console.error('Error marking the notification as seen', error);
      }
    }
  };

  const deleteAnnouncement = async (id: number) => {
    try {
      await axios.delete(`/announcements/${id}`);
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  const saveAnnouncement = async (announcement: {
    id: number | null;
    content: string;
    title: string;
    subtitle: string;
    rewards: string;
  }) => {
    try {
      if (announcement.id) {
        await axios.put(`/announcements/${announcement.id}`, {
          message: announcement.content,
          title: announcement.title,
          subtitle: announcement.subtitle,
          rewards: announcement.rewards,
        });
      } else {
        await axios.post(`/announcements`, {
          message: announcement.content,
          title: announcement.title,
          subtitle: announcement.subtitle,
          rewards: announcement.rewards,
        });
      }
    } catch (error) {
      console.error('Error saving announcement:', error);
    }
  };

  const likeAnnouncement = async (announcementId: number) => {
    try {
      const response = await axios.post(`/announcements/like`, { announcementId });
      if (!response.status) {
        console.error('Failed to like the notification');
      }
    } catch (error) {
      console.error('Error liking the notification', error);
    }
  };

  const claimAnnouncement = async (announcementId: number) => {
    try {
      const response = await axios.post(`/announcements/claim-rewards`, { announcementId });
      if (!response.status) {
        console.error('Failed to claim rewards');
      }
    } catch (error) {
      console.error('Error claiming rewards', error);
    }
  };

  const fetchTodayAnnouncement = async () => {
    try {
      const response = await axios.get(`/announcements`);
      const data: AnnouncementType[] = response.data;

      const today = new Date().toISOString().split('T')[0];
      const todayAnnouncement = data.find(announcement => announcement.meta === today);
      setTodayAnnouncement(todayAnnouncement || null);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  return {
    announcements,
    seenAnnouncements,
    todayAnnouncement,
    fetchAnnouncements,
    markAsSeen,
    deleteAnnouncement,
    saveAnnouncement,
    likeAnnouncement,
    claimAnnouncement,
    fetchTodayAnnouncement,
  };
};

export default useAnnouncements;
