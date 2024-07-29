import { ReactNode } from 'react';
import { ThemeColor } from 'src/@core/layouts/types';

export interface AnnouncementType {
  id: number;
  meta: string;
  avatarAlt: string;
  avatarImg: string;
  title: string;
  subtitle: string;
  rewards: string;
  content: string; // Ensure 'content' is included
}

export interface BaseNotificationType {
  id: number;
  title: string;
  subtitle: string;
}

export interface NotificationsType extends BaseNotificationType {
  id: number;
  meta: string;
  avatarAlt: string;
  avatarImg: string;
  title: string;
  subtitle: string;
  rewards: string;

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
