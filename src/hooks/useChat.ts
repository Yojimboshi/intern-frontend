// src/hooks/useChat.ts
import { useState, useCallback } from 'react';
import axios from 'src/configs/axiosConfig';
import { ChatType, ChannelType } from 'src/types/apps/chatType';

const useChat = () => {
  const [channelData, setChannelData] = useState<ChannelType[]>([]);
  const [chatData, setChatData] = useState<ChatType[]>([]);

  // Fetch all channels
  const fetchChannelData = useCallback(async () => {
    try {
      const response = await axios.get('/channels');
      setChannelData(response.data);
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  }, []);

  // Fetch messages for a specific channel
  const fetchChatData = useCallback(async (channelId: number) => {
    try {
      const response = await axios.get(`/channels/${channelId}/messages`);
      setChatData(response.data);
    } catch (error) {
      console.error('Error fetching chat data:', error);
    }
  }, []);

  // Like a message
  const likeMessage = async (channelId: number, messageId: number) => {
    try {
      await axios.post(`/channels/${channelId}/messages/${messageId}/like`);
      await fetchChatData(channelId);
    } catch (error) {
      console.error('Error liking message:', error);
    }
  };

  // Join a channel
  const joinChannel = async (channelId: number) => {
    try {
      await axios.post(`/channels/${channelId}/join`);
      await fetchChannelData();
    } catch (error) {
      console.error('Error joining channel:', error);
    }
  };

  // Leave a channel
  const leaveChannel = async (channelId: number) => {
    try {
      await axios.post(`/channels/${channelId}/leave`);
      await fetchChannelData();
    } catch (error) {
      console.error('Error leaving channel:', error);
    }
  };

  // Create a new channel
  const createChannel = async (channel: ChannelType) => {
    try {
      const response = await axios.post('/channels', channel);
      setChannelData((prevChannels) => [...prevChannels, response.data]);
    } catch (error) {
      console.error('Error creating channel:', error);
    }
  };

  // Update an existing channel
  const updateChannel = async (channel: ChannelType) => {
    try {
      await axios.put('/channels', channel);
      await fetchChannelData();
    } catch (error) {
      console.error('Error updating channel:', error);
    }
  };

  // Delete a channel
  const deleteChannel = async (channelId: number) => {
    try {
      await axios.delete(`/channels/${channelId}`);
      await fetchChannelData();
    } catch (error) {
      console.error('Error deleting channel:', error);
    }
  };

  // Send a message
  const sendMessage = async (channelId: number, message: string) => {
    try {
      await axios.post(`/channels/${channelId}/post`, { message });
      await fetchChatData(channelId);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return {
    channelData,
    chatData,
    fetchChannelData,
    fetchChatData,
    likeMessage,
    joinChannel,
    leaveChannel,
    createChannel,
    updateChannel,
    deleteChannel,
    sendMessage,
  };
};

export default useChat;
