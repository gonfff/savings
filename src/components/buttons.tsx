import { TableRowButtonProps } from '@/types/buttons';

export const TableRowButton = (props: TableRowButtonProps) => {
  return (
    <div class="dropdown dropdown-end">
      <div
        tabindex="0"
        role="button"
        class="btn btn-square btn-outline border-0 btn-xs rounded-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M5 6.5H19V8H5V6.5Z" fill="#1F2328" />
          <path d="M5 16.5H19V18H5V16.5Z" fill="#1F2328" />
          <path d="M5 11.5H19V13H5V11.5Z" fill="#1F2328" />
        </svg>
      </div>
      <ContextMenu editFunc={props.editFunc} deleteFunc={props.deleteFunc} />
    </div>
  );
};

const ContextMenu = (props: TableRowButtonProps) => {
  return (
    <ul
      tabindex="0"
      class="dropdown-content menu bg-base-100 z-[1] w-32 p-2 shadow"
    >
      <li>
        <a class="rounded-none" onClick={props.editFunc}>
          Edit
        </a>
      </li>
      <li>
        <a class="rounded-none" onClick={props.deleteFunc}>
          Delete
        </a>
      </li>
    </ul>
  );
};
