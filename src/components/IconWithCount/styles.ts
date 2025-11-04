import FontAwesome from '@react-native-vector-icons/fontawesome';
import styled from 'styled-components/native';

interface IIconProps {
  count: number;
}

export const Icon = styled(FontAwesome)<IIconProps>`
  margin-right: ${(props) => (props.count === 0 ? 0 : 8)}px;
`;

export const InnerContainer = styled.View`
  position: absolute;
  right: 10px;
  top: 10px;
  background-color: yellow;
  border-radius: 8px;
  width: 16px;
  height: 16px;
  justify-content: center;
  align-items: center;
`;

export const BadgeTxt = styled.Text`
  color: black;
  font-size: 12px;
`;
