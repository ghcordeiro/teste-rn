import Button from '@components/Button';
import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {Platform} from 'react-native';
import Modal from 'react-native-modal';
import {useAuth} from 'src/hooks/UserContext';
import api from 'src/services/api';
import {Container, ContainerButton, VideoComponent} from './styles';

export interface ReciveProps {
  renderPlayer: () => void;
}

interface IVideoPlayerComponentProps {
  id: string;
  loading: (status: boolean) => void;
}

const VideoPlayerComponent: React.ForwardRefRenderFunction<
  ReciveProps,
  IVideoPlayerComponentProps
> = ({id, loading}: IVideoPlayerComponentProps, ref) => {
  const videoRef = useRef<Video>(null);
  const [visible, setVisible] = useState(false);

  const auth = useAuth();

  const renderPlayer = () => {
    setTimeout(() => {
      setVisible(true);
      videoRef.current?.render();
      videoRef.current?.presentFullscreenPlayer();
      loading(false);
    }, 2000);
  };

  useImperativeHandle(ref, () => {
    return {
      renderPlayer,
    };
  });

  return (
    <>
      {Platform.OS === 'android' && (
        <>
          <VideoComponent
            source={{
              uri: `${api.defaults.baseURL}assayresult/video-streaming-file/${id}/video.mp4?authorization=${auth.user?.token}`,
              type: 'video/mp4',
            }}
            paused
            fullscreenAutorotate={true}
            controls
            fullscreenOrientation="landscape"
            ref={videoRef}
            resizeMode="contain"
            onError={e => {
              console.error(
                'VideoPlayer =>',
                e,
                id,
                `${api.defaults.baseURL}assayresult/video-streaming-file/${id}/video.mp4?authorization=${auth.user?.token}`,
              );
            }}
          />
        </>
      )}
      {Platform.OS === 'ios' && (
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
          <Container>
            {visible && Platform.OS === 'ios' && (
              <VideoComponent
                source={{
                  uri: `${api.defaults.baseURL}assayresult/video-streaming-file/${id}/video.mp4?authorization=${auth.user?.token}`,
                  type: 'video/mp4',
                }}
                ref={videoRef}
                paused
                fullscreenAutorotate={true}
                controls
                resizeMode="contain"
                onError={e => {
                  console.error(
                    'VideoPlayer =>',
                    e,
                    id,
                    `${api.defaults.baseURL}assayresult/video-streaming-file/${id}/video.mp4?authorization=${auth.user?.token}`,
                  );
                }}
              />
            )}

            <ContainerButton>
              <Button
                loading={false}
                onPress={() => setVisible(false)}
                icon="close"
                size="small">
                close
              </Button>
            </ContainerButton>
          </Container>
        </Modal>
      )}
    </>
  );
};

export default forwardRef(VideoPlayerComponent);
