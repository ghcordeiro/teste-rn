import {IAttachmentProps} from '@dtos/attachment';
import {TextRegular} from '@globalStyle';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Alert} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import api from 'src/services/api';
import {navigate} from 'src/services/navigation';
import Toast from 'src/utils/toast';
import {Container} from './styles';

interface ICardAttachmentProps {
  data: IAttachmentProps;
  onDownload: (status: boolean) => void;
  routeToDownload: string;
}

export interface ICardAttatchmentFileReciveProps {
  isLoading: boolean;
}

const CardAttachmentFile: React.ForwardRefRenderFunction<
  ICardAttatchmentFileReciveProps,
  ICardAttachmentProps
> = ({data, onDownload, routeToDownload}: ICardAttachmentProps, ref) => {
  const [isLoading, setIsLoading] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      isLoading,
    };
  });

  const openFile = (fileId: string) => {
    ReactNativeBlobUtil.config({
      fileCache: true,
      appendExt: 'pdf',
    })
      .fetch(
        'GET',
        `${api.defaults.baseURL}${routeToDownload}/download/${fileId}`,
        {
          Authorization: api.defaults.headers.Authorization,
        },
      )
      .then(res => {
        if (res.info().status === 510) {
          onDownload(false);
          Alert.alert(
            'O arquivo está sendo processado',
            'O processamento do arquivo pode levar até 10 minutos, por favor tente novamente mais tarde!',
            [{text: 'Ok', onPress: () => {}}],
          );
          console.log('error', res);
        } else if (res.info().status === 200) {
          onDownload(false);
          navigate('PDF', {anexo: res.path()});
        } else {
          onDownload(false);
          Toast.show(
            `Erro ao buscar o informativo. Consulte o suporte com a mensagem ${
              res.json().message
            }`,
            {
              duration: 5000,
            },
          );
        }
      })
      .catch(e => console.log('catch -> ', e));
  };

  return (
    <Container
      onPress={() => {
        setIsLoading(true);
        onDownload(true);
        openFile(data.assayResultFileId || '');
      }}>
      <FontAwesome name="file-pdf-o" size={25} style={{color: '#ADADAD'}} />
      <TextRegular color="#3D3D3D" marginLeft={8}>
        {data.fileName}
      </TextRegular>
    </Container>
  );
};

export default forwardRef(CardAttachmentFile);
