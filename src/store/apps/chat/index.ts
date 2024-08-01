import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'src/configs/axiosConfig'
import { Dispatch } from 'redux'
import { SendMessageParamsType, UserType, ChannelType, MessageType } from 'src/types/apps/chatTypes'

// Fetch User Profile
export const fetchUserProfile = createAsyncThunk('appChat/fetchUserProfile', async () => {
  const response = await axios.get('/users/current')

  return response.data
})

// Fetch Active Channels
export const fetchActiveChannels = createAsyncThunk('appChat/fetchActiveChannels', async () => {
  const response = await axios.get('/channel')

  return response.data
})

// Select Channel
export const selectChannel = createAsyncThunk(
  'appChat/selectChannel',
  async (channelId: number | string, { dispatch }: { dispatch: Dispatch<any> }) => {
    const response = await axios.get(`/channel/${channelId}`)
    await dispatch(fetchMessages(channelId))

    return response.data
  }
)

// Send Message
export const sendMessage = createAsyncThunk(
  'appChat/sendMessage',
  async (obj: SendMessageParamsType, { dispatch }) => {
    const response = await axios.post(`/channel/${obj.channelId}/post`, {
      message: obj.message
    })
    await dispatch(fetchMessages(obj.channelId))

    return response.data
  }
)

// Fetch Messages
export const fetchMessages = createAsyncThunk(
  'appChat/fetchMessages',
  async (channelId: number | string) => {
    const response = await axios.get(`/channel/${channelId}/messages`)

    return response.data
  }
)

export const appChatSlice = createSlice({
  name: 'appChat',
  initialState: {
    activeChannels: null as ChannelType[] | null,
    userProfile: null as UserType | null,
    selectedChannel: null as ChannelType | null,
    messages: null as MessageType[] | null
  },
  reducers: {
    removeSelectedChannel: state => {
      state.selectedChannel = null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload
      })
      .addCase(fetchActiveChannels.fulfilled, (state, action) => {
        state.activeChannels = action.payload
      })
      .addCase(selectChannel.fulfilled, (state, action) => {
        state.selectedChannel = action.payload
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        if (state.messages) {
          state.messages.push(action.payload)
        } else {
          state.messages = [action.payload]
        }
      })
  }
})

export const { removeSelectedChannel } = appChatSlice.actions

export default appChatSlice.reducer
