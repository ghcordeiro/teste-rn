// import { Alert, Platform } from 'react-native';
// import ReactNativeBlobUtil from 'react-native-blob-util';
// // import Toast from 'react-native-tiny-toast';
// import { mkdir, DocumentDirectoryPath, exists, write } from 'react-native-fs';
// import api from 'src/services/api';

// const getFilePath = async (username: string, filename?: string) => {
//   let path: string;
//   if (Platform.OS === 'ios') {
//     path = `${DocumentDirectoryPath}`;
//   } else {
//     path = `/storage/emulated/0`;
//   }

//   const directoryExists = await exists(path);
//   if (!directoryExists) {
//     mkdir(path).catch(() => {
//       path = `${path}/Ecooperativa`;
//     });
//   }

//   if (!(await exists(`${path}/Ecooperativa/${username}/`))) {
//     mkdir(`${path}/Ecooperativa/${username}/`).catch(() => {
//       path = `${path}/Ecooperativa/`;
//     });
//   }

//   return `${path}/Ecooperativa/${username}/${filename}`;
// };

// async function openFile(
//   username: string,
//   filePath?: string,
//   filename?: string
// ) {
//   const pathFile = filePath || (await getFilePath(username, filename));

//   if (Platform.OS === 'ios') {
//     ReactNativeBlobUtil.ios.previewDocument(pathFile);
//   } else {
//     ReactNativeBlobUtil.android.actionViewIntent(pathFile, '');

//     // RNFetchBlob.android.actionViewIntent(pathFile, "*/*");
//     // I've tried setting a real mimetype instead of / but it still doesn't work , 'image/png'
//     if (
//       pathFile.toString().includes('.doc') ||
//       pathFile.toString().includes('.docx')
//     ) {
//       // Word document
//       ReactNativeBlobUtil.android.actionViewIntent(
//         pathFile,
//         'application/msword'
//       );
//     } else if (pathFile.toString().includes('.pdf')) {
//       // PDF file
//       ReactNativeBlobUtil.android.actionViewIntent(pathFile, 'application/pdf');
//     } else if (
//       pathFile.toString().includes('.ppt') ||
//       pathFile.toString().includes('.pptx')
//     ) {
//       // Powerpoint file
//       ReactNativeBlobUtil.android.actionViewIntent(
//         pathFile,
//         'application/vnd.ms-powerpoint'
//       );
//     } else if (
//       pathFile.toString().includes('.xls') ||
//       pathFile.toString().includes('.xlsx')
//     ) {
//       // Excel file
//       ReactNativeBlobUtil.android.actionViewIntent(
//         pathFile,
//         'application/vnd.ms-excel'
//       );
//     } else if (
//       pathFile.toString().includes('.zip') ||
//       pathFile.toString().includes('.rar')
//     ) {
//       // WAV audio file
//       ReactNativeBlobUtil.android.actionViewIntent(
//         pathFile,
//         'application/x-wav'
//       );
//     } else if (pathFile.toString().includes('.rtf')) {
//       // RTF file
//       ReactNativeBlobUtil.android.actionViewIntent(pathFile, 'application/rtf');
//     } else if (
//       pathFile.toString().includes('.wav') ||
//       pathFile.toString().includes('.mp3')
//     ) {
//       // WAV audio file
//       ReactNativeBlobUtil.android.actionViewIntent(pathFile, 'audio/x-wav');
//     } else if (pathFile.toString().includes('.gif')) {
//       // GIF file
//       ReactNativeBlobUtil.android.actionViewIntent(pathFile, 'image/gif');
//     } else if (
//       pathFile.toString().includes('.jpg') ||
//       pathFile.toString().includes('.jpeg') ||
//       pathFile.toString().includes('.png')
//     ) {
//       // JPG file
//       ReactNativeBlobUtil.android.actionViewIntent(pathFile, 'image/jpeg');
//     } else if (pathFile.toString().includes('.txt')) {
//       // Text file
//       ReactNativeBlobUtil.android.actionViewIntent(pathFile, 'text/plain');
//     } else if (
//       pathFile.toString().includes('.3gp') ||
//       pathFile.toString().includes('.mpg') ||
//       pathFile.toString().includes('.mpeg') ||
//       pathFile.toString().includes('.mpe') ||
//       pathFile.toString().includes('.mp4') ||
//       pathFile.toString().includes('.avi')
//     ) {
//       // Video files
//       ReactNativeBlobUtil.android.actionViewIntent(pathFile, 'video/*');
//     } else {
//       // if you want you can also define the intent type for any other file
//       // additionally use else clause below, to manage other unknown extensions
//       // in this case, Android will show all applications installed on the device
//       // so you can choose which application to use
//       ReactNativeBlobUtil.android.actionViewIntent(pathFile, '*/*');
//     }
//   }
// }

// const downloadFile = (url: string, username: string) => {
//   let path: string;
//   if (Platform.OS === 'ios') {
//     path = `${DocumentDirectoryPath}`;
//   } else {
//     path = `/storage/emulated/0`;
//   }

//   const load = Toast.showLoading('Gerando arquivo...');

//   ReactNativeBlobUtil.config({
//     fileCache: true,
//     appendExt: 'xlsx',
//     addAndroidDownloads: {
//       useDownloadManager: true,
//       notification: false,
//       path: `${path}/Ecooperativa/${username}/${username}-${new Date().getTime()}.xlsx`
//     }
//   })
//     .fetch('GET', url, {
//       Authorization: api.defaults.headers.Authorization,
//       producer: api.defaults.headers.producer
//     })
//     .then((res) => {
//       // const filename = res
//       //   .info()
//       //   .headers['content-disposition']?.replace('attachment; filename=', '');
//       Toast.hide(load);
//       openFile(username, res.path());
//     })
//     .catch((err) => {
//       Toast.hide(load);
//       console.log(err);
//     });
// };

// const downloadFileWithAxios = async (url: string, username: string) => {
//   const load = Toast.showLoading('Gerando arquivo...');
//   api
//     .get(url, {
//       responseType: 'blob'
//     })
//     .then(async (response) => {
//       const blob = new Blob([response.data], {
//         type:
//           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//         lastModified: new Date().getTime()
//       });

//       const filename = response.headers['content-disposition']?.replace(
//         'attachment; filename=',
//         ''
//       );

//       const fileReader = new FileReader();
//       fileReader.readAsDataURL(blob);

//       const filePath = await getFilePath(username, filename);

//       fileReader.onloadend = async ({ target }) => {
//         const base64 = target?.result as string;
//         write(filePath, base64, 0, 'base64').then(() => {
//           Toast.hide(load);
//           Alert.alert('Arquivo gerado com sucesso!', filePath);
//           console.log(filePath);
//           openFile(username, filePath);
//         });
//       };
//     })
//     .finally(() => {
//       Toast.hide(load);
//     });
// };

// export { downloadFile, openFile, downloadFileWithAxios };

export default { teste: 1 };
