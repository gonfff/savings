import { createContext, createSignal, JSX, useContext } from 'solid-js';

// Create a context to store trigger for reloading the page
const ReloadContext = createContext<{
  reload: () => boolean;
  setReload: (value: boolean) => void;
}>();

export const ReloadProvider = (props: { children: JSX.Element }) => {
  const [reload, setReload] = createSignal<boolean>(false);

  return (
    <ReloadContext.Provider value={{ reload, setReload }}>
      {props.children}
    </ReloadContext.Provider>
  );
};

export const getReloadContext = (): {
  reload: () => boolean;
  setReload: (value: boolean) => void;
} => {
  const context = useContext(ReloadContext);
  if (!context) {
    throw new Error('getReloadContext must be used within a ReloadProvider');
  }
  return context;
};
