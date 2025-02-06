import { LucideIcon } from "lucide-react";

export interface UserInfo {
  email: string;
  phoneNumber: string;
  address?: string;
  birthDate?: string;
  birthPlace?: string;
  nationality?: string;
  gender?: string;
  emergencyContact?: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  subscriptionType: string;
  status: boolean;
  expiresAt: string;
  remainingSlots?: number;
  userInfo: UserInfo;
}

export interface AccessLog {
  id: string;
  timestamp: string;
  door: number;
}

export interface UserDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdate: (user: User) => void;
}

export interface UserContactInfoProps {
  user: User;
  isEditing: boolean;
  editedUser: User | null;
  onUserChange: (field: string, value: any) => void;
}

export interface UserDetailsProps {
  user: User;
  isEditing: boolean;
  editedUser: User | null;
  onUserChange: (field: string, value: any) => void;
}

export interface UserSubscriptionInfoProps {
  user: User;
  isEditing: boolean;
  editedUser: User | null;
  onUserChange: (field: string, value: any) => void;
}

export interface FeatureCardProps {
  title: string;
  description: string;
  Icon: LucideIcon;
}

export interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
  }