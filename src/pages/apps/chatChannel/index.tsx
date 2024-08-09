// src/pages/apps/chat/index.tsx
import React, { useState, useEffect } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChannelList from 'src/views/apps/chat/admin/channelList';
import ChannelForm from 'src/views/apps/chat/admin/channelForm';
import useChat from 'src/hooks/useChat';
import { ChannelType } from 'src/types/apps/chatType';

const defaultChannel: ChannelType = {
  id: 0,
  fullName: '',
  chatId: 1,
  about: '',
  status: '',
  active: true,
  created_at: new Date(),
};

const ChatEditorPage = () => {
  const {
    channelData,
    fetchChannelData,
    createChannel,
    updateChannel,
    deleteChannel,
  } = useChat();

  const [editingChannel, setEditingChannel] = useState<ChannelType | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await fetchChannelData();
      setLoading(false);
    };

    fetchData();
  }, [fetchChannelData]);

  const handleSaveChannel = async (channel: ChannelType) => {
    if (channel.id === 0) {
      await createChannel(channel);
    } else {
      await updateChannel(channel);
    }
    fetchChannelData();
    setShowForm(false);
    setEditingChannel(null);
  };

  const handleDeleteChannel = async (id: number) => {
    await deleteChannel(id);
    fetchChannelData();
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4">Admin Channels</Typography>
        <Button onClick={() => setShowForm(true)} startIcon={<AddIcon />}>
          Add Channel
        </Button>
        {showForm && (
          <ChannelForm
            channel={editingChannel || defaultChannel}
            onSave={handleSaveChannel}
            onCancel={() => {
              setShowForm(false);
              setEditingChannel(null);
            }}
          />
        )}
      </Grid>
      <Grid item xs={12}>
        {loading ? (
          <Typography>Loading channels...</Typography>
        ) : (
          <ChannelList

            channels={channelData}
            onEdit={(channel: ChannelType) => {
              setEditingChannel(channel);
              setShowForm(true);
            }}
            onDelete={handleDeleteChannel}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default ChatEditorPage;
