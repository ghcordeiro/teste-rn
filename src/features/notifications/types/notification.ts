import { EFirebaseNotificationType } from '@enum/EFirebaseNotificationType';
import BaseModel from './base-model';

export interface IMobileNotification extends BaseModel {
  user: string;
  title?: string;
  message?: string;
  purpose?: string;
  description?: string;
  type: EFirebaseNotificationType;
  read: boolean;
  notificationOriginId?: string;
}