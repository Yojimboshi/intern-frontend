// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'src/configs/axiosConfig';

// ** Types
import { Dispatch } from 'redux'
import { SendMsgParamsType } from 'src/types/apps/chatTypes'

// ** Fetch User Profile
export const fetchUserProfile = createAsyncThunk('appChat/fetchUserProfile', async () => {
  const response = await axios.get('/users/current')

  return response.data
})

// ** Fetch Chats & Contacts
export const fetchChatsContacts = createAsyncThunk('appChat/fetchChatsContacts', async () => {
  const response = await axios.get('/chats')
  console.log(response.data)

  return response.data

})

// ** Select Chat
export const selectChat = createAsyncThunk(
  'appChat/selectChat',
  async (id: number | string, { dispatch }: { dispatch: Dispatch<any> }) => {
    const response = await axios.get(`/chats/${id}`)
    console.log("Selected Message: ", response)

    await dispatch(fetchChatsContacts())

    return response.data
  }
)
export const sendMsg = createAsyncThunk('appChat/sendMsg', async (obj: SendMsgParamsType, { dispatch }) => {
  const response = await axios.post('/chats/messages', {
    data: {
      obj
    }
  })
  if (obj.contact) {
    await dispatch(selectChat(obj.contact.id))
  }

  return response.data
})

export const appChatSlice = createSlice({
  name: 'appChat',
  initialState: {
    chats: null,
    contacts: null,
    userProfile: null,
    selectedChat: null
  },
  reducers: {
    removeSelectedChat: state => {
      state.selectedChat = null
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.userProfile = action.payload
    })
    builder.addCase(fetchChatsContacts.fulfilled, (state, action) => {
      console.log('Action payload for chats and contacts:', action.payload.contacts);
      state.contacts = action.payload.contacts
      state.chats = action.payload.chatsContacts
    })
    builder.addCase(selectChat.fulfilled, (state, action) => {
      state.selectedChat = action.payload
    })
  }
})

export const { removeSelectedChat } = appChatSlice.actions

export default appChatSlice.reducer
