import Colors from '@colors';
import {normalize} from '@size';
import {getBottomSpace} from '@utils/iPhoneXHelper';
import {ReactNode} from 'react';
import styled from 'styled-components/native';

interface ITextProps {
  color?: string;
  size?: number;
  textAlign?: 'left' | 'right' | 'center';
  marginBottom?: number;
  marginLeft?: number;
  marginTop?: number;
  marginRight?: number;
  textDecoration?: 'underline' | 'solid' | 'none';
  width?: number | string;
  flex?: number;
  maxWidth?: number | string;
}

interface IViewProps {
  marginBottom?: number;
  marginLeft?: number;
  marginTop?: number;
  marginRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingTop?: number;
  paddingRight?: number;
  justifyContent?:
    | 'flex-end'
    | 'flex-start'
    | 'center'
    | 'space-around'
    | 'space-between';
  alignItems?: 'center' | 'flex-end' | 'flex-start';
  flex?: number;
  backgroundColor?: string;
  height?: number | string;
  width?: number | string;
}

// export const TextMedium = styled.Text<ITextProps>`
//   color: ${(props) => (props.color ? props.color : Colors.default.text)};
//   font-family: 'Lato-Medium';
//   font-size: ${(props) => normalize(props.size ? props.size : 16)}px;
//   margin-bottom: ${(props) => (props.marginBottom ? props.marginBottom : 0)}px;
//   margin-top: ${(props) => (props.marginTop ? props.marginTop : 0)}px;
//   margin-left: ${(props) => (props.marginLeft ? props.marginLeft : 0)}px;
//   margin-right: ${(props) => (props.marginRight ? props.marginRight : 0)}px;
//   text-align: ${(props) => (props.textAlign ? props.textAlign : 'left')};
//   text-decoration: ${(props) =>
//     props.textDecoration ? props.textDecoration : 'none'};
// `;

export const TextLight = styled.Text<ITextProps>`
  color: ${props => (props.color ? props.color : Colors.default.text)};
  font-family: 'Lato-Light';
  font-size: ${props => normalize(props.size ? props.size : 16)}px;
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : 0)}px;
  margin-top: ${props => (props.marginTop ? props.marginTop : 0)}px;
  margin-left: ${props => (props.marginLeft ? props.marginLeft : 0)}px;
  margin-right: ${props => (props.marginRight ? props.marginRight : 0)}px;
  text-align: ${props => (props.textAlign ? props.textAlign : 'left')};
  text-decoration: ${props =>
    props.textDecoration ? props.textDecoration : 'none'};
  ${props => props.width && `width: ${props.width}`}
  ${props => props.flex && `flex: ${props.flex}`}
  ${props => props.maxWidth && `max-width: ${props.maxWidth}px`}
`;

export const TextBold = styled.Text<ITextProps>`
  color: ${props => (props.color ? props.color : Colors.default.text)};
  font-family: 'Lato-Bold';
  font-size: ${props => normalize(props.size ? props.size : 16)}px;
  font-weight: bold;
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : 0)}px;
  margin-top: ${props => (props.marginTop ? props.marginTop : 0)}px;
  margin-left: ${props => (props.marginLeft ? props.marginLeft : 0)}px;
  margin-right: ${props => (props.marginRight ? props.marginRight : 0)}px;
  text-align: ${props => (props.textAlign ? props.textAlign : 'left')};
  text-decoration: ${props =>
    props.textDecoration ? props.textDecoration : 'none'};
  ${props => props.width && `width: ${props.width}`}
  ${props => props.flex && `flex: ${props.flex}`}
  ${props => props.maxWidth && `max-width: ${props.maxWidth}px`}
`;

export const TextRegular = styled.Text<ITextProps>`
  color: ${props => (props.color ? props.color : Colors.default.text)};
  font-family: 'Lato-Regular';
  font-size: ${props => normalize(props.size ? props.size : 16)}px;
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : 0)}px;
  margin-top: ${props => (props.marginTop ? props.marginTop : 0)}px;
  margin-left: ${props => (props.marginLeft ? props.marginLeft : 0)}px;
  margin-right: ${props => (props.marginRight ? props.marginRight : 0)}px;
  text-align: ${props => (props.textAlign ? props.textAlign : 'left')};
  text-decoration: ${props =>
    props.textDecoration ? props.textDecoration : 'none'};
  ${props => props.width && `width: ${props.width}`}
  ${props => props.flex && `flex: ${props.flex}`}
`;

export const Row = styled.View<IViewProps>`
  flex-direction: row;
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : 0)}px;
  margin-top: ${props => (props.marginTop ? props.marginTop : 0)}px;
  margin-left: ${props => (props.marginLeft ? props.marginLeft : 0)}px;
  margin-right: ${props => (props.marginRight ? props.marginRight : 0)}px;
  padding-bottom: ${props => (props.paddingBottom ? props.paddingBottom : 0)}px;
  padding-top: ${props => (props.paddingTop ? props.paddingTop : 0)}px;
  padding-left: ${props => (props.paddingLeft ? props.paddingLeft : 0)}px;
  padding-right: ${props => (props.paddingRight ? props.paddingRight : 0)}px;
  justify-content: ${props =>
    props.justifyContent ? props.justifyContent : 'flex-start'};
  align-items: ${props => (props.alignItems ? props.alignItems : 'flex-start')};
  ${props => (props.flex ? `flex: ${props.flex}` : '')};
  ${props =>
    props.backgroundColor ? `background-color: ${props.backgroundColor}` : ''};
`;

export const Flex = styled.View<IViewProps>`
  flex: ${props => props.flex};
`;

export const CenteredFlex = styled.View`
  align-items: center;
  justify-content: center;
`;

export const StyledView = styled.View<IViewProps>`
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : 0)}px;
  margin-top: ${props => (props.marginTop ? props.marginTop : 0)}px;
  margin-left: ${props => (props.marginLeft ? props.marginLeft : 0)}px;
  margin-right: ${props => (props.marginRight ? props.marginRight : 0)}px;
  padding-bottom: ${props => (props.paddingBottom ? props.paddingBottom : 0)}px;
  padding-top: ${props => (props.paddingTop ? props.paddingTop : 0)}px;
  padding-left: ${props => (props.paddingLeft ? props.paddingLeft : 0)}px;
  padding-right: ${props => (props.paddingRight ? props.paddingRight : 0)}px;
  justify-content: ${props =>
    props.justifyContent ? props.justifyContent : 'flex-start'};
  align-items: ${props => (props.alignItems ? props.alignItems : 'flex-start')};
  ${props => (props.flex ? `flex: ${props.flex}` : '')};
  ${props =>
    props.backgroundColor ? `background-color: ${props.backgroundColor}` : ''};
  ${props => (props.height ? `height: ${props.height}` : '')};
  ${props => (props.width ? `width: ${props.width}` : '')};
`;

export const VersionContainer = styled.View`
  position: absolute;
  bottom: ${getBottomSpace()}px;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export interface IReactProps {
  children: ReactNode;
}

export const defaultShadow = () => {
  return `
  shadow-color: #000;
  shadow-offset: { width: 0; height: 0 };
  shadow-opacity: 0.4;
  shadow-radius: 5px;
  elevation: 5;`;
};

export const Divider = styled.View`
  width: 100%;
  height: 1px;
  background-color: ${Colors.default.dark_gray};
  margin: 16px 0;
`;

export const FlatListBottomSpace = styled.View`
  height: 32px;
  width: 100%;
`;

export const ContainerCard = styled.View`
  padding: 0 16px;
`;

export const StartFlatListSpacing = styled.View`
  padding: 0 16px;
  margin-top: 8px;
`;

export const EndFlatListSpacing = styled.View`
  height: 32px;
  width: 100%;
`;
