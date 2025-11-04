import Colors from '@colors';
import Header from '@components/Header';
import { TextBold } from '@globalStyle';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import Pdf from 'react-native-pdf';

interface IRouteProps {
  params?: {
    anexo?: string;
  };
}

const PDF = () => {
  const route: IRouteProps = useRoute();
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<{ uri: string; cache: boolean }>({
    uri: '',
    cache: false
  });

  useEffect(() => {
    setLoading(true);
    if (route.params && route.params.anexo !== '') {
      setSource({ uri: route.params.anexo || '', cache: false });
      setLoading(false);
    }
  }, [route.params]);

  return (
    <>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.primary.blue}
          style={{ marginTop: 32 }}
        />
      ) : (
        <>
          <Header showBackButton />
          {source.uri === '' && <TextBold>error</TextBold>}
          <Pdf
            source={source}
            style={{
              flex: 1,
              width: '100%',
              paddingHorizontal: 10
            }}
          />
        </>
      )}
    </>
  );
};

export default PDF;
