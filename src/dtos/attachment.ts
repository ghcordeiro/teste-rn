import BaseModel from './base-model';

export interface IAttachmentProps extends BaseModel {
  purpose?: string;
  description?: string;
  culture?: string;
  assayResultFileId?: string;
  fileName?: string;
  publishApp?: boolean;
  assayResultVideoId?: string;
  videoName?: string;
  videoQualities?: Array<string>;
}
