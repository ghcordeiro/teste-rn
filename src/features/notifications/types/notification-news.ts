export interface INotificationNewsProps {
  _id: string;
  active: boolean;
  version: number;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  attachments: Array<{
    fileName: string;
    mimetype: string;
    createdAt: string;
    attachmentId: string;
  }>;
}