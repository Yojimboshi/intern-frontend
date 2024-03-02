// src\store\apps\user\index.ts
import { Dispatch } from 'redux'

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { UsersType } from 'src/types/apps/userTypes'

// ** Axios Imports
import axiosInstance from 'src/configs/axiosConfig';

interface DataParams {
  q: string
  role: string
  status: string
  currentPlan: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// Helper function to determine avatarColor based on accountStatus
const getAvatarColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'primary';
    case 'restricted':
      return 'warning';
    case 'banned':
      return 'error';
    default:
      return 'default';
  }
};

export const fetchData = createAsyncThunk('appUsers/fetchData', async (params: DataParams) => {
  const queryParams = new URLSearchParams({
    role: params.role || '', // Assuming the 'role' is a string and can be empty
    packageId: params.currentPlan || '',
    accountStatus: params.status || '',
    search: params.q || ''
  });
  const response = await axiosInstance.get(`/admin/users?${queryParams.toString()}`);
  const users = response.data.map((user: UsersType) => ({
    ...user,
    fullName: `${user.firstName} ${user.lastName}`,
    avatarColor: getAvatarColor(user.status),
    currentPlan: user.currentPlan,
    status: user.accountStatus,
    avatar: ""   // url for avatar.
  }));

  return {
    users,
    total: users.length,
    params,
    allData: users
  };
});

export const updateUser = createAsyncThunk(
  'appUsers/updateUser',
  async (userData: UsersType, { dispatch, getState }: Redux) => {
    try {
      const updateData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
        accountStatus: userData.accountStatus,
        contact: userData.contact,
        isEmpty: userData.isEmpty,
      };

      // Send the update request to the server
      const response = await axiosInstance.put(`/admin/users/${userData.id}`, updateData);

      // If you want to refresh the list after the update
      dispatch(fetchData(getState().user.params));

      return response.data;
    } catch (error) {
      throw error;
    }
  }
);


// ** Add User
export const addUser = createAsyncThunk(
  'appUsers/addUser',
  async (data: { [key: string]: number | string | boolean }, { getState, dispatch }: Redux) => {
    const response = await axiosInstance.post('/admin/users/child-package', data)
    dispatch(fetchData(getState().user.params))

    return response.data
  }
)

// ** Toggle Ban Status
export const toggleBanStatus = createAsyncThunk(
  'appUsers/toggleBanStatus',
  async ({ id, action }: { id: number | string; action: 'ban' | 'restrict' | 'activate' }, { getState, dispatch }: Redux) => {
    const response = await axiosInstance.post(`/admin/users/toggle-ban/${id}?action=${action}`)
    dispatch(fetchData(getState().user.params))

    return response.data
  }
)

export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
    data: [] as any[],
    total: 1,
    params: {},
    allData: [] as any[]
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      console.log('fetchData.fulfilled: payload', action.payload);
      state.data = action.payload.users
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
    builder.addCase(updateUser.fulfilled, (state, action) => {

      // Assuming the response data includes the updated user object
      const updatedUser = action.payload;

      // Find the index of the user in the current state
      const index = state.data.findIndex((user) => user.id === updatedUser.id);

      // If the user is found, update it
      if (index !== -1) {
        state.data[index] = {
          ...state.data[index],
          ...updatedUser,
        };
      }
    });
  }
})

export default appUsersSlice.reducer
