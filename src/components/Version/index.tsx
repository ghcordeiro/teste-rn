import Colors from '@colors';
import {TextBold, VersionContainer} from '@globalStyle';
import CodePush from '@revopush/react-native-code-push';
import React, {useEffect, useState} from 'react';
import {getReadableVersion} from 'react-native-device-info';

export const Version: React.FC = () => {
  const [codePushVersion, setCodePushVersion] = useState<string>('');

  async function getCodePushVersion() {
    const version = await CodePush.getUpdateMetadata();
    console.log('version => ', version);
    if (version) {
      setCodePushVersion(version.label.replace('v', ''));
    }
  }

  useEffect(() => {
    getCodePushVersion();
  }, []);

  return (
    <VersionContainer>
      <TextBold color={Colors.white}>{`v${getReadableVersion()}${
        codePushVersion ? '.' + codePushVersion : ''
      }`}</TextBold>
    </VersionContainer>
  );
};
