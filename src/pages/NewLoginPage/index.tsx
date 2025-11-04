import { useRoute } from '@react-navigation/core';
import React, { useEffect, useState } from 'react'
import { User, useAuth } from 'src/hooks/UserContext';

interface IRouteProps {
  params?: {
    user?: User
    hasUser?: boolean
  };
}

const Login = () => {
  const auth = useAuth();
  const { params }: IRouteProps = useRoute();
  const [user, setUser] = useState<User | undefined>(params?.user)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params?.hasUser) {
      if (user) {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [params])

  return (
    <>
      <SafeAreaView style={{ backgroundColor: Colors.ecoop.darkGray }} />
      <Container
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled>
        <Scroll
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
          <CenteredFlex>
            <ECoop
              width={width - width / 4}
              height={width - 128}
              style={{ marginTop: -width / 4 }}
            />
          </CenteredFlex>
          <View>
            <InputMask
              autoFocus
              ref={inputRef}
              icon="id-card"
              type="cpf"
              placeholder={translate('cpf')}
              savedValue={auth.credentials?.login}
            // isEnable={auth.credentials?.login === null}
            />
            <Button
              size="normal"
              loading={loadingSearch}
              onPress={handleSubmit}
              enabled={inputRef.current?.isValid()}>
              next
            </Button>
          </View>
        </Scroll>
        <Version />
      </Container>
    </>
  )
}

export default Login;