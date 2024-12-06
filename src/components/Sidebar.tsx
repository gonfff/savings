import { createSignal } from "solid-js";
import { menuRoute } from "../Routes";

const [selectedMenu, setSelectedMenu] = createSignal("Dashboard");

const handleMenuClick = (menu: string) => {
  setSelectedMenu(menu);
};

export const Sidebar = ({ routes }: { routes: menuRoute[] }) => {
  return (
    <div class="h-screen grid grid-cols-[11rem_1fr]">
      <div class="menu flex">
        {/* bg-base-200 */}
        <SidebarTitle />
        <Menu routes={routes} />
        <SidebarSupport />
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
            class={`menu-item rounded-none  ${selectedMenu() === menu.name ? "active" : ""}`}
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

const SidebarSupport = () => {
  return (
    <div class="mt-auto my-4">
      <div class="divider"></div>
      <div class="text-center text-black opacity-50">
        <a href="https://gonfff.github.io/">Creds & Support</a>
      </div>
    </div>
  );
};
