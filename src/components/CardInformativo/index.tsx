import { TextRegular } from '@globalStyle';
import React, { forwardRef, useState } from 'react';
import { IAttachmentProps } from 'src/dtos/attachment';

import CardAttachmentFile from '@components/CardAttachmentFile';
import CardAttachmentVideo from '@components/CardAttachmentVideo';
import convertData from '@utils/convertData';
import { Body, Container, Header, ContainerVideo } from './styles';
import api from 'src/services/api';
import { Platform } from 'react-native';

interface ICardInformativoProps {
  data: IAttachmentProps;
  // eslint-disable-next-line react/require-default-props
  onDownload: (status: boolean) => void;
  onLoadVideo: (status: boolean) => void;
}

export interface ReciveProps {
  isLoading: boolean;
}

const CardInformativo: React.ForwardRefRenderFunction<
  ReciveProps,
  ICardInformativoProps
> = ({ data, onDownload, onLoadVideo }: ICardInformativoProps, ref) => {
  const [cardOpen, setCardOpen] = useState(false);
  const [obj, setObj] = useState<IAttachmentProps>({} as IAttachmentProps)

  const handleCardOpen = async () => {
    const response = await api.get(`assayresult/${data._id}`)
    setObj(response.data);
    setCardOpen(!cardOpen);
  };

  return (
    <>
      <Container onPress={handleCardOpen}>
        <Header>
          <TextRegular width='70%' size={13} numberOfLines={1}>{data.purpose}</TextRegular>
          <TextRegular size={13}>
            {convertData(new Date(data.updatedAt).getTime(), '/')}
          </TextRegular>
        </Header>
        {cardOpen && (
          <Body>
            <TextRegular size={12}>{data.description}</TextRegular>
            {obj.assayResultFileId && (
              <CardAttachmentFile
                data={obj}
                onDownload={onDownload}
                ref={ref}
                routeToDownload="assayresult"
              />
            )}
            {obj.assayResultVideoId && Platform.OS === 'ios' && (
              <CardAttachmentVideo
                data={obj}
                ref={ref}
                onLoadVideo={onLoadVideo}
              />
            )}
          </Body>
        )}
      </Container>
      {obj.assayResultVideoId && cardOpen && Platform.OS === 'android' && (
        <ContainerVideo>
          <CardAttachmentVideo
            data={obj}
            ref={ref}
            onLoadVideo={onLoadVideo}
          />
        </ContainerVideo>
      )}
    </>
  );
};

export default forwardRef(CardInformativo);
