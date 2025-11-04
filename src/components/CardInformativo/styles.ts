import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
  width: 100%;
  margin: 10px 0 5px 0;
  background-color: #fff;
  padding: 8px 20px;
  flex-direction: column;
  border-radius: 5px;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Body = styled.View`
  width: 100%;
  flex-direction: column;
  border-radius: 5px;
  margin: 8px 0;
`;

export const ContainerVideo = styled.View`
  background-color: #fff;
`;
