import { Row, TextBold, TextRegular } from '@globalStyle';
import FontAwesome, {
  FontAwesomeIconName,
} from '@react-native-vector-icons/fontawesome';
import convertAfterDot from '@utils/convertAfterDot';
import convertCurrency from '@utils/convertCurrency';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ICardGraphData, ICardGraphProps } from 'src/dtos/graphics';
import Loading from 'src/shared/components/Loading';
import { mountData } from './mountData';

import { Container, Section } from './styles';

interface ICardCharProps {
  data?: ICardGraphData;
  loading: boolean;
}

interface IProps {
  firstLine: Array<ICardGraphProps>;
  secondLine: Array<ICardGraphProps>;
}

const CardChart = ({ data, loading }: ICardCharProps) => {
  const [cData, setCData] = useState<IProps>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (data) {
      const response = mountData(data);
      setCData(response);
    }
  }, [data, loading]);

  useEffect(() => {
    setIsLoading(false);
  }, [cData]);

  const renderFirstLine = () => {
    return (
      <View style={{ flexDirection: 'row' }}>
        {cData?.firstLine.map((d, index) => (
          <>
            <Container key={`firstLine-${d.title}-${index}`}>
              <Section>
                <TextRegular size={12}>{d.title}</TextRegular>
              </Section>
              <View
                style={{
                  flex: 3,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {d.values.map((v, vIndex) => {
                  return (
                    <Row
                      key={`firstLine-value-${index}-${vIndex}`}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <TextBold marginRight={4} size={18} color={v.color}>
                        {v?.prefix?.includes('%')
                          ? `${convertAfterDot(v.value, 2)} ${v.prefix}`
                          : `${convertCurrency(v.value, v.prefix)}`}
                      </TextBold>
                      {v.icon && (
                        <FontAwesome
                          name={v.icon as FontAwesomeIconName}
                          size={v.iconSize || 28}
                          color={v.color}
                        />
                      )}
                    </Row>
                  );
                })}
              </View>
            </Container>
            {cData.firstLine.length > 1 && index === 0 && (
              <View style={{ height: 2, width: 32 }} />
            )}
          </>
        ))}
      </View>
    );
  };

  const renderSecondLine = () => {
    return (
      <View style={{ flexDirection: 'row' }}>
        {cData?.secondLine.map((d, index) => (
          <>
            <Container key={`secondLine-${d.title}-${index}`}>
              <Section>
                <TextRegular size={12}>{d.title}</TextRegular>
              </Section>
              <View
                style={{
                  flex: 3,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {d.values.map((v, vIndex) => {
                  return (
                    <Row
                      key={`secondLine-value-${index}-${vIndex}`}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <TextBold marginRight={4} size={18} color={v.color}>
                        {v.prefix.includes('%')
                          ? `${convertAfterDot(v.value, 2)} ${v.prefix}`
                          : `${convertCurrency(v.value, v.prefix)}`}
                      </TextBold>
                      {v.icon && (
                        <FontAwesome
                          name={v.icon as FontAwesomeIconName}
                          size={v.iconSize || 28}
                          color={v.color}
                        />
                      )}
                    </Row>
                  );
                })}
              </View>
            </Container>
            {cData.secondLine.length > 1 && index === 0 && (
              <View style={{ height: 2, width: 32 }} />
            )}
          </>
        ))}
      </View>
    );
  };

  return (
    <>
      {isLoading && cData ? (
        <Loading />
      ) : (
        <View style={{ flexDirection: 'column' }}>
          <View style={{ flexDirection: 'column' }}>{renderFirstLine()}</View>
          <View style={{ flexDirection: 'column', marginTop: 16 }}>
            {renderSecondLine()}
          </View>
        </View>
      )}
    </>
  );
};

export default CardChart;
