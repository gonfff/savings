import { createSignal } from 'solid-js';

export const TableRowButton = () => {
  return (
    <div class="dropdown dropdown-end">
      <div
        tabindex="0"
        role="button"
        class="btn btn-square btn-outline border-0 btn-xs"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <ul
        tabindex="0"
        class="dropdown-content menu bg-base-100 z-[1] w-32 p-2 shadow"
      >
        <li>
          <a>Edit</a>
        </li>
        <li>
          <a>Delete</a>
        </li>
      </ul>
    </div>
  );
};
