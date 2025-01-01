import { fetchTheme } from '@/core/themes';
import { createContext, createSignal, JSX, useContext } from 'solid-js';

const ThemeContext = createContext<{
  theme: () => string;
  setTheme: (value: string) => void;
}>();

export const ThemeProvider = (props: { children: JSX.Element }) => {
  const [theme, setTheme] = createSignal<string>('light');

  fetchTheme().then((theme) => setTheme(theme));

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export const getThemeContext = (): {
  theme: () => string;
  setTheme: (value: string) => void;
} => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('getThemeContext must be used within a ThemeProvider');
  }
  return context;
};
