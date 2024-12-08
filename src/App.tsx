import { Router } from '@solidjs/router';
import { Routes } from './Routes.tsx';
import { Sidebar } from './components/sidebar.tsx';

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

{
  /* <div class='bg-red-400'></div>
<div class='bg-blue-400'></div> */
}
