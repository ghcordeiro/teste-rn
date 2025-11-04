import Colors from '@colors';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import FontAwesome from '@react-native-vector-icons/fontawesome';
import { getBottomSpace } from '@utils/iPhoneXHelper';
import { FlatList, Modal, SafeAreaView, View } from 'react-native';

import TextBold from '../TextBold';
import TextRegular from '../TextRegular';
import {
  BackButton,
  Body,
  CancelButton,
  Container,
  Header,
  Item,
  Touch,
} from './styles';

interface ISelectProps {
  name: string;
  propertyValue: string;
  propertyLabel: string;
  defaultValue: string;
  returnObject?: boolean;
  options: any[];
  onActionChange?: (value: any) => void;
}

function Select({
  propertyValue = 'value',
  propertyLabel = 'label',
  defaultValue = '',
  returnObject = false,
  options = [],
  name,
  onActionChange = () => {},
}: ISelectProps) {
  const listRef = useRef(null);
  const [selectItem, setSelectItem] = useState<any>({});
  const [dataPicker, setDataPicker] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const defaultOption: any = {};
    defaultOption[propertyValue] = defaultValue;
    defaultOption[propertyLabel] = 'Selecione uma Opção!';
    let data = options;
    if (!data || data.length === 0) {
      data = [defaultOption];
    }
    const defaultSelected = data.find(
      (f: any) => f[propertyValue] === defaultOption[propertyValue],
    );
    setDataPicker(data);
    setSelectItem(defaultSelected || data[0]);
  }, [defaultValue, options, propertyLabel, propertyValue]);

  const onChange = useCallback(
    (item: any) => {
      setSelectItem(item);
      onActionChange(returnObject ? item : item[propertyValue]);
      setModalVisible(false);
    },
    [onActionChange, propertyValue, returnObject],
  );

  const render = (item: any, index: number) => {
    return (
      <>
        <Item
          key={`${name}@${index.toString()}`}
          onPress={() => {
            setModalVisible(false);
            onChange(item);
          }}
        >
          <TextRegular key={`${name}@${index.toString()}`}>
            {item[propertyLabel]}
          </TextRegular>
        </Item>
        {index === dataPicker.length - 1 ? (
          <View style={{ height: 64 + getBottomSpace(), width: '100%' }} />
        ) : null}
      </>
    );
  };

  return (
    <View key={name}>
      <Container>
        <Touch onPress={() => setModalVisible(true)}>
          <TextRegular>
            {selectItem ? selectItem[propertyLabel] : 'Selecione uma Opção!'}
          </TextRegular>
          <FontAwesome name="chevron-down" size={16} />
        </Touch>
        <Modal
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <SafeAreaView style={{ backgroundColor: Colors.ecoop.darkGray }} />
          <Header>
            <BackButton onPress={() => setModalVisible(false)}>
              <FontAwesome
                name="chevron-left"
                size={24}
                color={Colors.ecoop.darkGray}
              />
            </BackButton>
            <TextRegular flex={4} textAlign="center">
              Selecione uma opção
            </TextRegular>
            <CancelButton onPress={() => setModalVisible(false)}>
              <TextBold color={Colors.blue.blue_2}>Cancelar</TextBold>
            </CancelButton>
          </Header>
          <Body>
            <FlatList
              key={`Select@${name}`}
              ref={listRef}
              data={dataPicker}
              keyExtractor={(_item, index) =>
                `Select@${name}[${index.toString()}]`
              }
              renderItem={({ item, index }) => render(item, index)}
            />
          </Body>
        </Modal>
      </Container>
    </View>
  );
}

export default Select;
