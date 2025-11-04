import { TextRegular } from '@globalStyle';
import { downloadFile } from '@utils/downloadFileToStorage';
import React from 'react';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import api from 'src/services/api';
import { IAttachmentDeliveryOrder } from '../../../../types/delivery-order';
import { Container } from './styles';

interface ICardAttachmentProps {
  data: IAttachmentDeliveryOrder;
  closeModal: () => void;
}

const CardAttachmentWithdrawal = ({
  data,
  closeModal
}: ICardAttachmentProps) => {
  const file = data.fileName.split('.');

  const handleDownload = async () => {
    closeModal();
    await downloadFile(
      `${api.defaults.baseURL}delivery-order/download/${data.attachmentId}`,
      file[0],
      `.${file[1]}`
    );
  };

  return (
    <Container onPress={handleDownload}>
      <FontAwesome name="file-pdf-o" size={25} style={{ color: '#ADADAD' }} />
      <TextRegular color="#3D3D3D" marginLeft={8}>
        {data.fileName}
      </TextRegular>
    </Container>
  );
};

export default CardAttachmentWithdrawal;
