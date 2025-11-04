import {translate} from '@translate';
import {Platform} from 'react-native';
import ReactNativeBlobUtil, {
  ReactNativeBlobUtilConfig,
} from 'react-native-blob-util';
import Toast from './toast';
import api from 'src/services/api';

function getMimeType(fileExtension: string): string {
  const ext = fileExtension
    ? fileExtension.replace('.', '').toLowerCase()
    : undefined;
  // RNFetchBlob.android.actionViewIntent(pathFile, "*/*");
  // I've tried setting a real mimetype instead of / but it still doesn't work , 'image/png'
  if (!ext) {
    return '*/*';
  }
  if (['doc'].includes(ext)) {
    // Word document
    return 'application/msword';
  }
  if (['docx'].includes(ext)) {
    // Word document
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  if (['pdf'].includes(ext)) {
    // PDF file
    return 'application/pdf';
  }
  if (['ppt'].includes(ext)) {
    // Powerpoint file
    return 'application/vnd.ms-powerpoint';
  }
  if (['pptx'].includes(ext)) {
    // Powerpoint file
    return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
  }
  if (['xls'].includes(ext)) {
    // Excel file
    return 'application/vnd.ms-excel application/x-excel';
  }
  if (['xlsx'].includes(ext)) {
    // Excel file
    return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  }
  if (['zip', 'rar'].includes(ext)) {
    // Compress file
    return 'application/octet-stream';
  }
  if (['rtf'].includes(ext)) {
    // RTF file
    return 'application/rtf';
  }
  if (['wav', 'mp3'].includes(ext)) {
    // WAV audio file
    return 'audio/x-wav';
  }
  if (['gif'].includes(ext)) {
    // GIF file
    return 'image/gif';
  }
  if (['jpg', 'jpeg', 'png'].includes(ext)) {
    // JPG file
    return 'image/jpeg';
  }
  if (['txt'].includes(ext)) {
    // Text file
    return 'text/plain';
  }
  if (['3gp', 'mpg', 'mpeg', 'mpe', 'mp4', 'avi'].includes(ext)) {
    // Video files
    return 'video/*';
  }
  // if you want you can also define the intent type for any other file
  // additionally use else clause below, to manage other unknown extensions
  // in this case, Android will show all applications installed on the device
  // so you can choose which application to use
  return '*/*';
}

const downloadFile = async (
  url: string,
  fileName: string,
  fileExtension: string,
): Promise<void> => {
  const load = Toast.showLoading(translate('labelLoading'));
  const diretory = 'Ecooperativa';
  const {fs, config} = ReactNativeBlobUtil;
  const {
    dirs: {DownloadDir, DocumentDir},
    exists,
    mkdir,
  } = fs;
  const isIOS = Platform.OS === 'ios';

  let path = Platform.select({ios: DocumentDir, android: DownloadDir});
  console.log('System Path: ', path);
  if (!path || !(await exists(path))) {
    throw new Error(
      translate('errorCouldNotGetDirectory', {plataforma: Platform.OS}),
    );
  }

  if (!(await exists(`${path}/${diretory}`))) {
    console.log('System App Path not exists, creating ... ');
    try {
      await mkdir(`${path}/${diretory}`);
      console.log('System App Path created!!');
    } catch (error: any) {
      console.error(`Create dir ${diretory} on path ${path}. Error: `, error);
      throw new Error(
        `Error create Application Dir ${diretory}. Error: ${
          error?.message ? error?.message : error
        }`,
      );
    }
  }

  path = `${path}/${diretory}`;

  console.log('System App Path: ', path);
  const finalFileName = `${`${
    fileName
      ? fileName.replace('.', '-')
      : 'download' /* se não passar nome do arquiv, criar nome padrão download */
  }-${new Date().getTime()}`}${
    fileExtension
      ? `.${fileExtension.replace('.', '')}`
      : '' /* se não passar extenção cria sem extenção */
  }`;
  console.log('Final File name: ', finalFileName);
  const filePath = `${path}/${finalFileName}`;
  console.log('File Path: ', filePath);

  const configOptions = Platform.select({
    ios: {
      fileCache: true,
      path: filePath,
      notification: true,
    },

    android: {
      fileCache: false,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: filePath,
        title: finalFileName,
        mime: getMimeType(fileExtension),
        description: `Downloading${
          fileExtension ? ` ${fileExtension.replace('.', '')}` : ''
        }...`,
      },
    },
  });

  console.log('start downloading with headers: ', {
    Authorization: api.defaults.headers.Authorization,
    producer: api.defaults.headers.producer,
  });
  console.log('URL download: ', url);
  const apiResponse = await api.get(url);
  if (apiResponse.status === 204) {
    Toast.hide(load);
    return Promise.reject(new Error('NO_DATA'));
  }
  console.log('start downloading... ');
  await config(configOptions as ReactNativeBlobUtilConfig)
    .fetch('GET', url, {
      Authorization: api.defaults.headers.Authorization,
      producer: api.defaults.headers.producer,
    })
    .then(async res => {
      console.log('download sucess!!');
      if (isIOS) {
        console.log('IOS File: ', res.data);
        setTimeout(() => {
          console.log('IOS open File ... ');
          try {
            Toast.hide(load);
            ReactNativeBlobUtil.ios.openDocument(res.data);
            return Promise.resolve();
          } catch (error) {
            console.error('Error open File ios: ', error);
            return Promise.reject();
          }
        }, 5000);
      } else {
        console.log('Android File: ', res.path());
        console.log('Android open File ... ');
        try {
          Toast.hide(load);
          await ReactNativeBlobUtil.android.actionViewIntent(res.path(), '*/*');
          return Promise.resolve();
        } catch (error) {
          console.error('Error open File Android: ', error);
        }
      }
    })
    .catch(err => {
      console.error('Error get download: ', err);
      /** TODO: Mostrar uma mensagem para tentar novamente mais tarde. */
      Toast.hide(load);
      return Promise.reject(err);
    });
};

export {downloadFile};
