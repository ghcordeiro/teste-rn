import { TextRegular } from '@globalStyle';
import styled from 'styled-components/native';

export const ModalContainer = styled.View`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
`;

export const ModalTitle = styled(TextRegular)`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
`;

export const InputContainer = styled.View`
  margin-bottom: 15px;
`;

export const ModalButtonContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 20px;
`;
