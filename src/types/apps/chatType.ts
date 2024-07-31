export interface ChannelType {

  id: number,
  name: string,
  description: string,
  active: boolean,
  created_at: Date

}

export interface ChatType {

  id: number,
  userId: number,
  channelId: number,
  message: string,
  created_at: Date

}
