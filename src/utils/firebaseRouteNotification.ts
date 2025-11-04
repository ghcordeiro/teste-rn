import { EFirebaseNotificationType } from '@enum/EFirebaseNotificationType';

interface IProps {
  data?: {
    type: EFirebaseNotificationType;
    notificationId?: string;
    notificationOriginId?: string;
  };
}

export const firebaseRouteNotification = ({ data }: IProps) => {
  if (!data) {
    return null;
  }

  switch (EFirebaseNotificationType[data.type]) {
    case EFirebaseNotificationType.ASSAYRESULT:
      return {
        name: 'Informativos',
        params: {
          notificationId: data.notificationId,
          notificationOriginId: data.notificationOriginId
        }
      };
    case EFirebaseNotificationType.NEWS:
      return {
        name: 'Notificacao',
        params: {
          notificationId: data.notificationId,
          notificationOriginId: data.notificationOriginId
        }
      };
    case EFirebaseNotificationType.NOTIFICATION:
      return {
        name: 'Notificacao',
        params: {
          notificationId: data.notificationId,
          notificationOriginId: data.notificationOriginId
        }
      };
    case EFirebaseNotificationType.WITHDRAWALSTATUS:
      return {
        name: 'Notificacao',
        params: {
          notificationId: data.notificationId,
          notificationOriginId: data.notificationOriginId
        }
      };
    default:
      return null;
  }
};
