import { Picker } from '@react-native-picker/picker';
import { translate } from '@translate';
import React, { useEffect, useRef, useState } from 'react';
import { Container } from './styles';

export interface IPropsSimplePicker {
  name: string;
  propertyValue: string;
  propertyLabel: string;
  defaultValue: string;
  returnObject?: boolean;
  options: any[];
  onActionChange?: (value: any) => void;
}

const SimplePicker = ({
  propertyValue = 'value',
  propertyLabel = 'label',
  defaultValue = '',
  returnObject = false,
  options = [],
  name,
  onActionChange = () => {}
}: IPropsSimplePicker) => {
  const pickerRef = useRef(null);
  const [valueSelect, setValueSelect] = useState('');
  const [dataPicker, setDataPicker] = useState<any[]>([]);

  useEffect(() => {
    const defaultOption: any = {};
    defaultOption[propertyValue] = defaultValue;
    defaultOption[propertyLabel] = 'Selecione uma Opção!';
    let data = options;

    if (!data || data.length === 0) {
      data = [defaultOption];
    }

    const defaultSelected = data.find(
      (f: any) => f[propertyValue] === defaultOption[propertyValue]
    );

    setDataPicker(data);
    setValueSelect(
      defaultSelected ? defaultSelected[propertyValue] : data[0][propertyValue]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (value: string) => {
    setValueSelect(value);
    if (returnObject) {
      onActionChange(dataPicker.find((f: any) => f[propertyValue] === value));
    } else {
      onActionChange(value);
    }
  };

  return (
    <Container>
      <Picker
        key={name}
        ref={pickerRef}
        selectedValue={valueSelect}
        onValueChange={onChange}>
        {dataPicker.map((d: any) => {
          return (
            <Picker.Item
              label={translate(d[propertyLabel], {
                defaultValue: d[propertyLabel]
              })}
              value={d[propertyValue]}
              key={d}
            />
          );
        })}
      </Picker>
    </Container>
  );
};

export default SimplePicker;
