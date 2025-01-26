import { Sidebar } from '@/components/sidebar';
import { Toaster } from '@/components/toast';
import { Routes } from '@/routes';
import { Router } from '@solidjs/router';
import { EnvProvider, getEnvContext } from './components/contexts/environment';
import { getThemeContext, ThemeProvider } from './components/contexts/theme';
import { availableEnvs } from './types/environment';

export default function App() {
  return (
    <>
      <EnvProvider>
        <ThemeProvider>
          <Main />
        </ThemeProvider>
      </EnvProvider>
      <Toaster />
    </>
  );
}

const Main = () => {
  const { theme } = getThemeContext();
  const { env } = getEnvContext();

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
  };

  return (
    <div
      class="overflow-hidden w-screen h-screen grid grid-cols-[12rem_1fr]"
      data-theme={theme()}
      {...(env() != availableEnvs.Development
        ? { onContextMenu: handleContextMenu }
        : {})}
    >
      <Sidebar routes={Routes} />
      <Router>{Routes}</Router>
    </div>
  );
};
