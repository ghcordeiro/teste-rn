import { IAttachmentProps } from '@dtos/attachment';
import { TextRegular } from '@globalStyle';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import VideoPlayer, { ReciveProps as VideoProps } from 'src/pages/VideoPlayer';
import { Container } from './styles';

interface ICardAttachmentProps {
  data: IAttachmentProps;
  onLoadVideo: (status: boolean) => void;
}

export interface ICardAttachmentVideoReciveProps {
  isLoading: boolean;
}

const CardAttachmentVideo: React.ForwardRefRenderFunction<
  ICardAttachmentVideoReciveProps,
  ICardAttachmentProps
> = ({ data, onLoadVideo }: ICardAttachmentProps, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const refVideo = useRef<VideoProps>(null)

  useImperativeHandle(ref, () => {
    return {
      isLoading
    };
  });

  const load = (status: boolean) => {
    setIsLoading(status);
    onLoadVideo(status);
  }

  return (
    <>
      <Container
        onPress={() => {
          setIsLoading(true)
          onLoadVideo(true);
          refVideo.current?.renderPlayer()
        }}>
        <FontAwesome name="file-video-o" size={25} style={{ color: '#ADADAD' }} />
        <TextRegular color="#3D3D3D" marginLeft={8}>
          {data.videoName}
        </TextRegular>
      </Container>
      <VideoPlayer 
        ref={refVideo} 
        id={data.assayResultVideoId || ''} 
        loading={load}
      />
    </>
  );
};

export default forwardRef(CardAttachmentVideo);
