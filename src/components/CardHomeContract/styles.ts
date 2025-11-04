import styled from 'styled-components/native';
import Colors from '@colors';
import { height, normalize, normalizeHeight } from '@size';

interface ITextProps {
  color?: string;
  size?: number;
  textAlign?: 'left' | 'right' | 'center';
  marginBottom?: number;
  marginLeft?: number;
  marginTop?: number;
  marginRight?: number;
  textDecoration?: 'underline' | 'solid' | 'none';
}

export const Container = styled.TouchableOpacity`
  background-color: ${Colors.white};
  border-radius: 8px;
  width: 100%;
  height: ${normalizeHeight(height * 0.3)}px;
`;

export const ContainerRows = styled.View`
  justify-content: space-between;
  flex: 1;
  padding-bottom: ${normalizeHeight(4)}px;
`;

export const HeaderContainer = styled.View`
  width: 100%;
  height: ${normalizeHeight(32)}px;
  background-color: ${Colors.dark};
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  padding: 0 8px;
  justify-content: center;
`;

export const TextData = styled.Text<ITextProps>`
  color: ${(props) => (props.color ? props.color : Colors.default.text)};
  font-family: 'Lato-Bold';
  font-size: ${(props) => normalize(props.size ? props.size : 16)}px;
  font-weight: bold;
  flex: 1;
  margin-bottom: ${(props) => (props.marginBottom ? props.marginBottom : 0)}px;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : 0)}px;
  margin-left: ${(props) => (props.marginLeft ? props.marginLeft : 0)}px;
  margin-right: ${(props) => (props.marginRight ? props.marginRight : 0)}px;
  text-align: ${(props) => (props.textAlign ? props.textAlign : 'center')};
  text-decoration: ${(props) =>
    props.textDecoration ? props.textDecoration : 'none'};
`;

export const TextLightHome = styled.Text<ITextProps>`
  color: #000000;
  font-family: 'Lato-Regular';
  flex: 8;
  font-size: ${(props) => normalize(props.size ? props.size : 15)}px;
  margin-bottom: ${(props) => (props.marginBottom ? props.marginBottom : 0)}px;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : 0)}px;
  margin-left: ${(props) => (props.marginLeft ? props.marginLeft : 0)}px;
  margin-right: ${(props) => (props.marginRight ? props.marginRight : 0)}px;
  text-align: ${(props) => (props.textAlign ? props.textAlign : 'left')};
  text-decoration: ${(props) =>
    props.textDecoration ? props.textDecoration : 'none'};
`;

export const TextRegularHome = styled.Text<ITextProps>`
  color: ${(props) => (props.color ? props.color : Colors.default.text)};
  font-family: 'Lato-Regular';
  flex: 5;
  font-size: ${(props) => normalize(props.size ? props.size : 16)}px;
  margin-bottom: ${(props) => (props.marginBottom ? props.marginBottom : 0)}px;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : 0)}px;
  margin-left: ${(props) => (props.marginLeft ? props.marginLeft : 0)}px;
  margin-right: ${(props) => (props.marginRight ? props.marginRight : 0)}px;
  text-align: ${(props) => (props.textAlign ? props.textAlign : 'left')};
  text-decoration: ${(props) =>
    props.textDecoration ? props.textDecoration : 'none'};
`;
