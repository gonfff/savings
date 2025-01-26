import { fetchEnv } from '@/core/environment';
import { createContext, createSignal, JSX, useContext } from 'solid-js';

const EnvContext = createContext<{
  env: () => string;
  setEnv: (value: string) => void;
}>();

export const EnvProvider = (props: { children: JSX.Element }) => {
  const [env, setEnv] = createSignal<string>('production');

  fetchEnv().then((env) => setEnv(env));

  return (
    <EnvContext.Provider value={{ env, setEnv }}>
      {props.children}
    </EnvContext.Provider>
  );
};

export const getEnvContext = (): {
  env: () => string;
  setEnv: (value: string) => void;
} => {
  const context = useContext(EnvContext);
  if (!context) {
    throw new Error('getEnvContext must be used within a EnvProvider');
  }
  return context;
};
