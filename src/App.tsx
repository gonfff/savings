import { Router } from '@solidjs/router';
import { Sidebar } from './components/sidebar.tsx';
import { Routes } from './Routes.tsx';

export default function App() {
  return (
    <div
      class="h-screen overflow-hidden w-full grid grid-cols-[12rem_1fr]"
      data-theme="light"
    >
      <Sidebar routes={Routes} />
      <Router>{Routes}</Router>
    </div>
  );
}
