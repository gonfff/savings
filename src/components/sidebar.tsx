import { menuRoute } from '@/types/sidebar';
import { createSignal } from 'solid-js';

const [selectedMenu, setSelectedMenu] = createSignal('Dashboard');

const handleMenuClick = (menu: string) => {
  setSelectedMenu(menu);
};

export const Sidebar = ({ routes }: { routes: menuRoute[] }) => {
  return (
    <div class="h-screen grid grid-cols-[11rem_1fr]">
      <div class="menu flex">
        <SidebarTitle />
        <Menu routes={routes} />
      </div>
      <div class="divider divider-horizontal -ml-1 -mr-2"></div>
    </div>
  );
};

const Menu = ({ routes }: { routes: menuRoute[] }) => {
  return (
    <ul>
      {routes.map((menu) => (
        <li>
          <a
            class={`menu-item rounded-none ${selectedMenu() === menu.name ? 'active' : ''}`}
            onClick={() => handleMenuClick(menu.name)}
            href={menu.path}
          >
            {menu.name}
          </a>
        </li>
      ))}
    </ul>
  );
};

const SidebarTitle = () => {
  return (
    <>
      <div class="menu-title my-8 text-center">Savings</div>
      <div class="divider -mt-4"></div>
    </>
  );
};
