import ModalAssayResult, { IModalAssayResultProps } from '@components/ModalAssayResult';
import ModalNews, { IModalNewsProps } from '@components/ModalNews';
import ModalTrackWithdrawal, { IModalTrackWithdrawalProps } from '@components/ModalTrackWithdrawal';
import { IMobileNotification } from '@dtos/notification';
import { EFirebaseNotificationType } from '@enum/EFirebaseNotificationType';
import { TextBold, TextRegular } from '@globalStyle';
import convertData from '@utils/convertData';
import React, { useRef } from 'react';
import { Body, Container, Header } from './styles';

interface ICardNotificationProps {
  data: IMobileNotification;
  onDownload: (status: boolean) => void;
  onLoadVideo: (status: boolean) => void;
}

const CardNotification = ({
  data,
  onDownload,
  onLoadVideo,
}: ICardNotificationProps) => {
  const modalTrackRef = useRef<IModalTrackWithdrawalProps>(null);
  const modalAssayResultRef = useRef<IModalAssayResultProps>(null);
  const modalNewsRef = useRef<IModalNewsProps>(null);

  const openModal = () => {
    if (data.type === EFirebaseNotificationType.WITHDRAWALSTATUS && data.notificationOriginId) {
      modalTrackRef.current?.openModal(data.notificationOriginId);
    } else if (data.type === EFirebaseNotificationType.ASSAYRESULT && data.notificationOriginId) {
      modalAssayResultRef.current?.openModal(data)
    } else if (data.type === EFirebaseNotificationType.NEWS && data.notificationOriginId) {
      modalNewsRef.current?.openModal(data)
    }
  }
  
  return (
    <>
      <Container
        onPress={() => {
          openModal();
        }}>
        <Header>
          <TextBold size={13} numberOfLines={1} width='70%'>{data.title || data.purpose}</TextBold>
          <TextBold size={13}>
            {convertData(new Date(data.updatedAt).getTime(), '/')}
          </TextBold>
        </Header>
        <Body>
          <TextRegular size={12}>{data.message || data.description}</TextRegular>
        </Body>
      </Container>
      <ModalTrackWithdrawal ref={modalTrackRef} />
      <ModalAssayResult ref={modalAssayResultRef} onDownload={onDownload} onLoadVideo={onLoadVideo} />
      <ModalNews ref={modalNewsRef} onDownload={onDownload} onLoadVideo={onLoadVideo} />
    </>
  );
};

export default CardNotification;
