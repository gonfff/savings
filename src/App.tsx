import { Sidebar } from '@/components/sidebar';
import { Toaster } from '@/components/toasts';
import { Routes } from '@/routes';
import { Router } from '@solidjs/router';

export default function App() {
  return (
    <div
      class="h-screen overflow-hidden w-full grid grid-cols-[12rem_1fr]"
      data-theme="light"
    >
      <Sidebar routes={Routes} />
      <Router>{Routes}</Router>
      <Toaster />
    </div>
  );
}
