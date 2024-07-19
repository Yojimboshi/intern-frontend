// src\store\index.ts
import { configureStore } from '@reduxjs/toolkit'
import chat from 'src/store/apps/chat'
import user from 'src/store/apps/user'
import email from 'src/store/apps/email'
import invoice from 'src/store/apps/invoice'
import calendar from 'src/store/apps/calendar'
import permissions from 'src/store/apps/permissions'
import pools from 'src/store/apps/v2Pools';
import transaction from 'src/store/apps/transaction';
import downlines from 'src/store/apps/downlines';

// NOTE: add announcement store import entry here
// also add store/apps/announcement, refer to vpool 

export const store = configureStore({
  reducer: {
    user,
    chat,
    email,
    invoice,
    calendar,
    permissions,
    pools,
    transaction,
    downlines
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
