import axios from 'axios';
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {IServer, IServerConfig} from 'src/dtos/server';
import api from 'src/services/api';
import getServers from 'src/services/management';
import StorageService from 'src/services/storage';
import Toast from 'src/utils/toast';

interface ServerContextData {
  serversConfig: Array<IServerConfig>;
  envServer?: IServerConfig;
  apiServer?: IServer;
  getConfigServer: (cpf: string) => Promise<void>;
  configApiServer(config: IServerConfig): Promise<void>;
  clearServers(): void;
}

const Server = createContext<ServerContextData>({} as ServerContextData);

const ServerContext = ({children}: PropsWithChildren) => {
  const [serversConfig, setServersConfig] = useState(
    [] as Array<IServerConfig>,
  );
  const [envServer, setEnvServer] = useState<IServerConfig>();
  const [apiServer, setApiServer] = useState<IServer>();

  useEffect(() => {
    (async () => {
      const srvs = await StorageService.getStorage('ServersConfig');
      const env = await StorageService.getStorage('ServersConfig');
      const api: IServer = await StorageService.getStorage('ApiServer');
      setServersConfig(srvs);
      setEnvServer(env);
      setApiServer(api);
      if (api && api.url) {
        setBaseURL(api);
      }
    })();
  }, []);
  const setBaseURL = (apiServer: IServer): void => {
    api.defaults.baseURL = `${apiServer.url}/mobile/`;
  };
  const configApiServer = async (envServer: IServerConfig) => {
    setEnvServer(undefined);
    setApiServer(undefined);
    api.defaults.baseURL = '';
    if (!envServer) {
      Toast.show('Nenhum Ambiente de Servidor selecionado!');
      throw new Error('Nenhum Ambiente de Servidor selecionado');
    }
    if (envServer.servers.length === 0) {
      Toast.show(
        `O Ambiente (${envServer.code}) da cooperativa (${envServer.companyCode}) não possui servidores ativos!`,
      );
      throw new Error(
        `O Ambiente (${envServer.code}) da cooperativa (${envServer.companyCode}) não possui servidores ativos!`,
      );
    }
    let okApiServer!: IServer;
    for (const srv of envServer.servers.sort(
      (a, b) => a.priority - b.priority,
    )) {
      try {
        await axios.get(`${srv.url}/healthcheck`, {
          timeout: 5000,
        });
        okApiServer = srv;
        break;
      } catch (e) {
        console.log(`Healthcheck server: ${srv.url}. Error: `, e);
      }
    }
    if (!okApiServer) {
      Toast.show(
        `O Ambiente (${envServer.code}) da cooperativa (${envServer.companyCode}) não está respondendo. Tente novamente em instantes!`,
      );
      throw new Error(
        `O Ambiente (${envServer.code}) da cooperativa (${envServer.companyCode}) não está respondendo. Tente novamente em instantes!`,
      );
    }
    setBaseURL(okApiServer);
    setEnvServer(envServer);
    setApiServer(okApiServer);
    await StorageService.setStorage('envServer', envServer);
    await StorageService.setStorage('ApiServer', okApiServer);
  };

  const getConfigServer = async (cpf: string): Promise<void> => {
    try {
      const response = await getServers(cpf);
      const servers = response.data.map(
        (item: IServerConfig): IServerConfig => ({
          ...item,
          companyCodeTxt:
            item.env !== 'production'
              ? `${item.companyCode} [${item.code}]`
              : item.companyCode,
          servers: item.servers.sort((a, b) => a.priority - b.priority),
        }),
      );
      console.log(`getConfigServer (${cpf}) => `, servers);
      setServersConfig(servers);
    } catch (e) {
      console.error('getConfigServer => ', e);
      throw e;
    }
  };

  const clearServers = async () => {
    await StorageService.removeStorage('ServersConfig');
    await StorageService.removeStorage('ServersConfig');
    await StorageService.removeStorage('ApiServer');
  };

  return (
    <Server.Provider
      value={{
        serversConfig,
        apiServer,
        envServer,
        getConfigServer,
        configApiServer,
        clearServers,
      }}>
      {children}
    </Server.Provider>
  );
};

function useServer(): ServerContextData {
  const context = useContext(Server);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export {ServerContext, useServer};
