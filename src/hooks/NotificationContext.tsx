import React, { PropsWithChildren, createContext, useContext } from 'react';

interface INotificationProps {
  name: string;
  params?: {
    notificationId?: string;
    notificationOriginId?: string;
  };
}

interface NotificationContextData {
  notificationSelected: INotificationProps;
  setNotificationSelected: React.Dispatch<
    React.SetStateAction<INotificationProps>
  >;
}

const Notification = createContext<NotificationContextData>(
  {} as NotificationContextData
);

const NotificationProvider = ({ children }: PropsWithChildren) => {
  let notificationSelected: INotificationProps = {} as INotificationProps;
  const setNotificationSelected = (notification: INotificationProps) => {
    notificationSelected = notification;
  };

  return (
    <Notification.Provider
      value={{ setNotificationSelected, notificationSelected }}>
      {children}
    </Notification.Provider>
  );
};

function useNotification() {
  const context = useContext(Notification);

  if (!context) {
    throw new Error(
      'useNotification must be used within an NotificationProvider'
    );
  }

  return context;
}

export { NotificationProvider, useNotification };
