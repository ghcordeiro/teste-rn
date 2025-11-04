import Colors from '@colors';
import {ReciveProps} from '@components/CardInformativo';
import CardNotification from '@components/CardNotification';
import Header from '@components/Header';
import Loading from '@components/Loading';
import {IMobileNotification} from '@dtos/notification';
import {EFirebaseNotificationType} from '@enum/EFirebaseNotificationType';
import {useRoute} from '@react-navigation/core';
import {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, FlatList, RefreshControl} from 'react-native';
import Toast from 'src/utils/toast';
import api from '../../services/api';

interface IRouteProps {
  params?: {
    notificationId?: string;
    notificationOriginId?: string;
    type?: EFirebaseNotificationType;
  };
}

const PageNotificationWithdrawal = () => {
  const {params = {}}: IRouteProps = useRoute();
  const listRef = useRef(null);
  const cardRef = useRef<ReciveProps>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [data, setData] = useState<Array<IMobileNotification>>(
    [] as Array<IMobileNotification>,
  );
  const [limit] = useState(20);
  const [allRows, setAllRows] = useState(0);

  const loadRepositories = useCallback(async () => {
    try {
      if (reload) {
        setLoading(true);
      }
      if (data.length >= allRows && allRows > 0) {
        setLoading(false);
        setReload(false);
        return;
      }

      const response = await api.get(
        `mobile-notification/WITHDRAWALSTATUS/list?skip=${data.length}&limit=${limit}&sort=-createdAt`,
      );

      setAllRows(response.data.allRows);
      setData([...data, ...response.data.rows]);
      setLoading(false);
      setReload(false);
    } catch (e) {
      setLoading(false);
      setReload(false);
      console.log(e);
    }
  }, [allRows, data, limit, reload]);

  useEffect(() => {
    loadRepositories();
  }, []);

  useEffect(() => {
    setLoading(!!cardRef.current?.isLoading);
  }, [cardRef]);

  const loadingFile = (status: boolean) => {
    let toastLoading;
    if (status) {
      toastLoading = Toast.showLoading('Baixando arquivo. Aguarde!');
    } else {
      Toast.hide(toastLoading);
    }
  };

  const loadingVideo = (status: boolean) => {
    let toastLoading;
    if (status) {
      toastLoading = Toast.showLoading('Carregando vídeo. Aguarde!');
    } else {
      Toast.hide(toastLoading);
    }
  };

  const renderFooter = useCallback(() => {
    if (!loading) {
      return null;
    }

    return (
      <ActivityIndicator
        size="large"
        color={Colors.primary.blue}
        style={{marginTop: 32}}
      />
    );
  }, [loading]);

  const onRefresh = () => {
    setReload(true);
    setData([]);
    loadRepositories();
  };

  const renderItem = (item: IMobileNotification, index: number) => (
    <CardNotification
      key={`${item._id}-${index}`}
      data={item}
      onDownload={loadingFile}
      onLoadVideo={loadingVideo}
    />
  );

  return (
    <>
      <Header showBackButton />
      {loading ? (
        <Loading />
      ) : (
        <>
          <FlatList
            data={data}
            ref={listRef}
            renderItem={({item, index}) => renderItem(item, index)}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => `${item._id}-${index}-${reload}`}
            refreshControl={
              <RefreshControl
                refreshing={reload}
                onRefresh={() => onRefresh()}
              />
            }
            refreshing={reload}
            onEndReached={() => loadRepositories()}
            onEndReachedThreshold={0.3}
            ListFooterComponent={() => renderFooter()}
            style={{paddingTop: 16}}
          />
        </>
      )}
    </>
  );
};

export default PageNotificationWithdrawal;
