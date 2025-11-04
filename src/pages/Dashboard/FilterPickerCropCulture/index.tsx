import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import Loading from 'src/components/Loading';
import api from 'src/services/api';
import { Container } from './styles';

interface IFilters {
  onHandleFilters: (filters: string) => void;
}

interface IDataProps {
  crop: string;
  culture: string;
  id: string;
}

const FilterPickerCropCulture = ({ onHandleFilters }: IFilters) => {
  const [data, setData] = useState<Array<string>>([] as Array<string>);
  const [loading, setLoading] = useState(true);
  const [valueSelect, setValueSelect] = useState('');

  const loadRepositories = async () => {
    const response = await api.get('salescontract/crop/list');
    const newData: Array<string> = ['Selecione um ano safra'];
    response.data.forEach((e: IDataProps) => {
      newData.push(`${e.culture}${e.crop ? ` - ${e.crop}` : ''}`);
    });
    setData(newData);
    setLoading(false);
  };

  useEffect(() => {
    loadRepositories();
  }, []);

  const handleChange = (value: string) => {
    // console.log(value);
    if (value !== '') {
      setValueSelect(value);
      onHandleFilters(value);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <Picker
            selectedValue={valueSelect}
            onValueChange={(itemValue: any) => handleChange(itemValue)}>
            {data.map((d) => {
              return <Picker.Item label={d} value={d} key={d} />;
            })}
          </Picker>
        </Container>
      )}
    </>
  );
};

export default FilterPickerCropCulture;
