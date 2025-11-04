import Colors from '@colors';
import { normalize } from '@size';
import styled from 'styled-components/native';
import { ITextProps } from '../../../../../assets/styles';

export const StyledText = styled.Text<ITextProps>`
  color: ${props => (props.color ? props.color : Colors.default.text)};
  font-family: 'Lato-Light';
  font-size: ${props => normalize(props.size ? props.size : 16)}px;
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : 0)}px;
  margin-top: ${props => (props.marginTop ? props.marginTop : 0)}px;
  margin-left: ${props => (props.marginLeft ? props.marginLeft : 0)}px;
  margin-right: ${props => (props.marginRight ? props.marginRight : 0)}px;
  text-align: ${props => (props.textAlign ? props.textAlign : 'left')};
  text-decoration-line: ${props =>
    props.textDecoration === 'underline' ? 'underline' : 'none'};
  ${props => props.width && `width: ${props.width}`}
  ${props => props.flex && `flex: ${props.flex}`}
  ${props => props.maxWidth && `max-width: ${props.maxWidth}px`}
`;

