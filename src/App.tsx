import { Sidebar } from '@/components/sidebar';
import { Toaster } from '@/components/toast';
import { Routes } from '@/routes';
import { Router } from '@solidjs/router';
import { getThemeContext, ThemeProvider } from './components/contexts/theme';

export default function App() {
  return (
    <>
      <ThemeProvider>
        <Main />
      </ThemeProvider>
      <Toaster />
    </>
  );
}

const Main = () => {
  const { theme } = getThemeContext();

  return (
    <div
      class="h-screen overflow-hidden w-full grid grid-cols-[12rem_1fr]"
      data-theme={theme()}
    >
      <Sidebar routes={Routes} />
      <Router>{Routes}</Router>
    </div>
  );
};
