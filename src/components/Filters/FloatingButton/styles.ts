import Colors from '@colors';
import { defaultShadow } from '@globalStyle';
import { RectButton } from 'react-native-gesture-handler';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import styled from 'styled-components/native';

interface IIconProps {
  count: number;
}

export const Icon = styled(AwesomeIcon)<IIconProps>`
  margin-right: ${(props) => (props.count === 0 ? 0 : 8)}px;
`;

export const ContainerFilter = styled.TouchableOpacity`
  width: 56px;
  height: 56px;
  position: absolute;
  align-items: center;
  justify-content: center;
  right: 30px;
  bottom: 30px;
  background-color: ${Colors.white};
  border-radius: 28px;
  ${defaultShadow()}
`;
