import {getBottomSpace} from '@utils/iPhoneXHelper';
import styled from 'styled-components/native';

export const VersionContainer = styled.View`
  position: absolute;
  bottom: ${getBottomSpace()}px;
  width: 100%;
  align-items: center;
  justify-content: center;
`;
