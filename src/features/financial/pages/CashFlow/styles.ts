import Colors from '@colors';
import { defaultShadow } from '@globalStyle';
import { height, normalizeHeight, width } from '@size';
import styled from 'styled-components/native';

interface IButtonChangeTabProps {
  isSelected: boolean;
}

export const Container = styled.View`
  flex: 1;
`;

export const SectionGeneral = styled.View`
  width: 100%;
  background-color: ${Colors.white};
`;

export const SectionTabs = styled.View`
  height: ${normalizeHeight(height - height * 0.17)}px;
  width: 100%;
  background-color: ${Colors.white};
`;

export const ContainerContractPosition = styled.View`
  padding: 8px;
  border-radius: 4px;
  background-color: ${Colors.white};
  ${defaultShadow()}
`;

export const ButtonChangeTab = styled.TouchableOpacity<IButtonChangeTabProps>`
  height: ${normalizeHeight(width / 4.5)}px;
  width: ${normalizeHeight(width / 4.5)}px;
  background-color: ${Colors.white};
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  ${props =>
    props.isSelected && `border: 1px solid ${Colors.default.dark_gray};`}
  ${defaultShadow()}
`;
