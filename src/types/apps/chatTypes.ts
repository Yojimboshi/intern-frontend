import { Dispatch } from 'redux'
import { ThemeColor } from 'src/@core/layouts/types'

export type StatusType = 'online' | 'offline' | 'away' | 'busy'

export type StatusObjType = {
  online: ThemeColor
  offline: ThemeColor
  away: ThemeColor
  busy: ThemeColor
}



export type UserType = {
  id: number
  username: string
  email: string
  avatar?: string
  status: StatusType
  avatarColor?: ThemeColor
}

export type ChannelType = {
  id: number
  name: string
  description: string
  active: boolean
  createdAt: string
  avatarColor?: ThemeColor
  avatar?: string
}

export type MessageType = {
  id: number
  channelId: number
  userId: number
  message: string
  createdAt: string
  feedback?: string
}


export type MsgFeedbackType = {
  isSent: boolean
  isSeen: boolean
  isDelivered: boolean
}



export type ChatStoreType = {
  activeChannels: ChannelType[] | null
  userProfile: UserType | null
  selectedChannel: ChannelType | null
  messages: MessageType[] | null
}

export type SendMessageParamsType = {
  channelId: number
  message: string
}

export type ChatContentType = {
  hidden: boolean
  mdAbove: boolean
  store: ChatStoreType
  sidebarWidth: number
  dispatch: Dispatch<any>
  statusObj: StatusObjType
  userProfileRightOpen: boolean
  handleLeftSidebarToggle: () => void
  getInitials: (val: string) => string
  sendMsg: (params: SendMessageParamsType) => void
  handleUserProfileRightSidebarToggle: () => void
}

export type ChatSidebarLeftType = {
  hidden: boolean
  mdAbove: boolean
  store: ChatStoreType
  sidebarWidth: number
  userStatus: StatusType
  dispatch: Dispatch<any>
  leftSidebarOpen: boolean
  statusObj: StatusObjType
  userProfileLeftOpen: boolean
  removeSelectedChannel: () => void
  selectChannel: (id: number) => void
  handleLeftSidebarToggle: () => void
  getInitials: (val: string) => string
  setUserStatus: (status: StatusType) => void
  handleUserProfileLeftSidebarToggle: () => void
  formatDateToMonthShort: (value: string, toTimeForCurrentDay: boolean) => void
}

export type UserProfileLeftType = {
  hidden: boolean
  store: ChatStoreType
  sidebarWidth: number
  userStatus: StatusType
  statusObj: StatusObjType
  userProfileLeftOpen: boolean
  setUserStatus: (status: StatusType) => void
  handleUserProfileLeftSidebarToggle: () => void
}

export type UserProfileRightType = {
  hidden: boolean
  store: ChatStoreType
  sidebarWidth: number
  statusObj: StatusObjType
  userProfileRightOpen: boolean
  getInitials: (val: string) => string
  handleUserProfileRightSidebarToggle: () => void
}

export type SendMsgComponentType = {
  store: ChatStoreType
  dispatch: Dispatch<any>
  sendMsg: (params: SendMessageParamsType) => void
}

export type ChatLogType = {
  hidden: boolean
  data: {
    channel: ChannelType
    messages: MessageType[]
  }
}
export type ChatLogChatType = {
  msg: string
  time: string | Date
  feedback: MsgFeedbackType
}

export type FormattedMessagesType = {
  userId: number
  messages: MessageType[]
}

export type MessageGroupType = {
  userId: number
  messages: MessageType[]
}
