 
import CardAttachmentFile, {
    ICardAttatchmentFileReciveProps,
} from '@components/CardAttachmentFile';
import CardAttachmentVideo, {
    ICardAttachmentVideoReciveProps,
} from '@components/CardAttachmentVideo';
import { IAttachmentProps } from '@dtos/attachment';
import { IMobileNotification } from 'src/features/notifications';
import { TextBold, TextRegular } from '@globalStyle';
import { AxiosResponse } from 'axios';
import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import Modal from 'react-native-modal';
import api from 'src/services/api';
import Toast from 'src/utils/toast';
import { ModalContainer } from './styles';

export interface IModalAssayResultProps {
  openModal: (id: IMobileNotification) => void;
  closeModal: () => void;
}

export interface IModalAssayResultFunctions {
  onDownload: (status: boolean) => void;
  onLoadVideo: (status: boolean) => void;
}

const ModalAssayResult: React.ForwardRefRenderFunction<
  IModalAssayResultProps,
  IModalAssayResultFunctions
> = ({onDownload, onLoadVideo}, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [item, setItem] = useState<IAttachmentProps>({} as IAttachmentProps);
  const [notification, setNotification] = useState<IMobileNotification>(
    {} as IMobileNotification,
  );

  const cardAttachmentFileRef = useRef<ICardAttatchmentFileReciveProps>(null);
  const cardAttachmentVideoRef = useRef<ICardAttachmentVideoReciveProps>(null);

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
      closeModal,
    };
  });

  useEffect(() => {
    async function load() {
      if (notification.notificationOriginId) {
        const response: AxiosResponse<IAttachmentProps> = await api.get(
          `assayresult/${notification.notificationOriginId}`,
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
    onDownload(status);
  };

  const loadingVideo = (status: boolean) => {
    let toastLoading;
    if (status) {
      toastLoading = Toast.showLoading('Carregando vídeo. Aguarde!');
    } else {
      Toast.hide(toastLoading);
    }

    onLoadVideo(status);
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
        <TextRegular>
          <TextBold>Objetivo: </TextBold>
          {item.purpose}
        </TextRegular>
        <TextRegular marginTop={8}>
          <TextBold>Descrição: </TextBold>
          {item.description}
        </TextRegular>
        <TextRegular marginTop={8}>
          <TextBold>Cultura: </TextBold>
          {item.culture}
        </TextRegular>

        {item.assayResultFileId && (
          <CardAttachmentFile
            data={item}
            onDownload={loadingFile}
            ref={cardAttachmentFileRef}
            routeToDownload="assayresult"
          />
        )}
        {item.assayResultVideoId && (
          <CardAttachmentVideo
            data={item}
            ref={cardAttachmentVideoRef}
            onLoadVideo={loadingVideo}
          />
        )}
      </ModalContainer>
    </Modal>
  );
};

export default forwardRef(ModalAssayResult);
