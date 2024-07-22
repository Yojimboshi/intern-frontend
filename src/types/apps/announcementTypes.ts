import { ReactNode } from 'react'
import { ThemeColor } from 'src/@core/layouts/types'

export type NotificationsType = {
  id: number
  meta: string
  title: string
  subtitle: string
  rewards?: string
} & (
    | {
      avatarAlt: string;
      avatarImg: string;
      avatarText?: never;
      avatarColor?: never;
      avatarIcon?: never
    }
    | {
      avatarAlt?: never
      avatarImg?: never
      avatarText: string
      avatarIcon?: never
      avatarColor?: ThemeColor
    }
    | {
      avatarAlt?: never
      avatarImg?: never
      avatarText?: never
      avatarIcon: ReactNode
      avatarColor?: ThemeColor
    }
  )


export type NotificationsAction = {
  id: number
  meta: string
  title: string
  subtitle: string
  rewards?: string
} & (
    | {
      avatarAlt: string;
      avatarImg: string;
      avatarText?: never;
      avatarColor?: never;
      avatarIcon?: never
    }
    | {
      avatarAlt?: never
      avatarImg?: never
      avatarText: string
      avatarIcon?: never
      avatarColor?: ThemeColor
    }
    | {
      avatarAlt?: never
      avatarImg?: never
      avatarText?: never
      avatarIcon: ReactNode
      avatarColor?: ThemeColor
    }
  )
