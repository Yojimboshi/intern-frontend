// src/hooks/useAnnounce.ts
import { useState, useEffect } from 'react'
import axios from 'axios'

interface AnnouncementType {
  meta: string
  avatarAlt: string
  avatarImg: string
  title: string
  subtitle: string
  rewards?: string
}

const useAnnounce = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([])

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_API_BASE_URL + '/announcements')
        setAnnouncements(response.data)
        console.log("Announcment data", response)
      } catch (error) {
        console.error('Error fetching announcements:', error)

      }
    }

    fetchAnnouncements()
  }, [])

  return announcements
}

export default useAnnounce
