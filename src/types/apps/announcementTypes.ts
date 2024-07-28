// src\types\apps\announcementTypes.ts
import { ReactNode } from 'react';
import { ThemeColor } from 'src/@core/layouts/types';

export interface AnnouncementType {
  id: number | null;
  content: string;
  title: string;
  subtitle: string;
  rewards: string;
}


export interface BaseNotificationType {
  id: number;
  title: string;
  subtitle: string;
}

export interface NotificationsType extends BaseNotificationType {
  content: string;
  rewards: string;
  avatarAlt: string;
  avatarImg: string;
  avatarText?: string;
  avatarColor?: string;
  avatarIcon?: string;
}


export type NotificationsAction = BaseNotificationType & (
  | {
    avatarAlt: string;
    avatarImg: string;
    avatarText?: never;
    avatarColor?: never;
    avatarIcon?: never;
  }
  | {
    avatarAlt?: never;
    avatarImg?: never;
    avatarText: string;
    avatarIcon?: never;
    avatarColor?: ThemeColor;
  }
  | {
    avatarAlt?: never;
    avatarImg?: never;
    avatarText?: never;
    avatarIcon: ReactNode;
    avatarColor?: ThemeColor;
  }
);
