/* eslint-disable no-underscore-dangle */
import CardAttachmentFile, { ICardAttatchmentFileReciveProps } from '@components/CardAttachmentFile';
import { IMobileNotification } from '@dtos/notification';
import { INotificationNewsProps } from '@dtos/notification-news';
import { TextBold, TextRegular } from '@globalStyle';
import { AxiosResponse } from 'axios';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import { FlatList } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import api from 'src/services/api';
import { ModalContainer } from './styles';

export interface IModalNewsProps {
  openModal: (id: IMobileNotification) => void;
  closeModal: () => void;
}

export interface IModalNewsFunctions {
  onDownload: (status: boolean) => void;
  onLoadVideo: (status: boolean) => void;
}

const ModalNews: React.ForwardRefRenderFunction<
  IModalNewsProps,
  IModalNewsFunctions
> = ({ onDownload }, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [item, setItem] = useState<INotificationNewsProps>({} as INotificationNewsProps);
  const [notification, setNotification] = useState<IMobileNotification>({} as IMobileNotification)

  const cardAttachmentFileRef = useRef<ICardAttatchmentFileReciveProps>(null);

  const openModal = useCallback(async (value: IMobileNotification) => {
    setVisible(true);
    setNotification(value);
  }, []);

  const closeModal = useCallback(() => {
    setVisible(false);
  }, []);

  useImperativeHandle(ref, () => {
    return {
      openModal,
      closeModal
    };
  });

  useEffect(() => {
    async function load() {
      if (notification.notificationOriginId) {
        const response: AxiosResponse<INotificationNewsProps> = await api.get(
          `news/get/${notification.notificationOriginId}`
        );

        setItem(response.data);
      }
    }

    load();
  }, [notification]);

  const loadingFile = (status: boolean) => {
    if (status) {
      setVisible(false);
    }
    onDownload(status)
  };

  return (
    <Modal
      isVisible={visible}
      backdropColor="#3b3b3b"
      backdropOpacity={0.9}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}
      onBackButtonPress={() => setVisible(false)}
      onBackdropPress={() => setVisible(false)}
      shouldRasterizeIOS>
      <ModalContainer>
      <TextRegular><TextBold>Título: </TextBold>{item.title}</TextRegular>
      <TextRegular marginTop={8}><TextBold>Mensagem: </TextBold>{item.message}</TextRegular>

          <FlatList
            data={item.attachments}
            renderItem={(data) => (
              <CardAttachmentFile 
                ref={cardAttachmentFileRef}
                data={{
                  _id: data.item.attachmentId,
                  createdAt: item.createdAt,
                  updatedAt: item.updatedAt,
                  assayResultFileId: data.item.attachmentId,
                  fileName: `${data.item.fileName}`
                }}
                onDownload={loadingFile}
                routeToDownload='news'
              />
            )}
          />
      </ModalContainer>
    </Modal>
  );
};

export default forwardRef(ModalNews);
