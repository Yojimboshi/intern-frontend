// src\types\apps\userTypes.ts
import { ThemeColor } from 'src/@core/layouts/types'

interface PackageType {
  id: number;
  packageName: string;
  price: number;
  sponsorBonusPercentage: number;
  matchingBonusPercentage: number;
  hierarchyBonusPercentage: number;
  maxHierarchyChildren: number;
}

export type UsersType = {
  id: number;
  role: string;
  status: string;
  username: string;
  avatarColor: string;
  country: string;
  company: string;
  contact: string;
  isEmpty: boolean;
  currentPlan: string;
  packageId: string;
  fullName: string;
  email: string;
  avatar: string;
  firstName?: string;
  lastName?: string;
  accountStatus?: string;
  referralId?: string | null;
  referredBy?: string | null;
  parentId?: string | null;
  sponsorBonus?: number;
  matchingBonus?: number;
  hierarchyBonus?: number;
  leftCarryForward?: number;
  rightCarryForward?: number;
  lastWithdrawalDate?: string | null;
  totalWithdrawnToday?: number;
  withdrawalRequestsToday?: number;
  totalDeposited?: number;
  totalWithdrawn?: number;
  package?: PackageType | null;
}

export type ProjectListDataType = {
  id: number
  img: string
  hours: string
  totalTask: string
  projectType: string
  projectTitle: string
  progressValue: number
  progressColor: ThemeColor
}


export interface RegisterUserPayload {
  username: string;
  email: string;
  password: string;
  referralId?: string; // Optional field
}
