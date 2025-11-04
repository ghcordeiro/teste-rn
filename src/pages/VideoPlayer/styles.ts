import {Dimensions, Platform} from 'react-native';
import Video from 'react-native-video';
import styled from 'styled-components/native';

export const Container = styled.View`
  margin-left: -20px;
  z-index: ${Platform.OS === 'android' && 1000};
`;

export const VideoComponent = styled(Video)`
  width: ${Dimensions.get('screen').width}px;
  height: ${Dimensions.get('screen').width}px;
  z-index: 1001;
`;

export const ContainerButton = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
`;
