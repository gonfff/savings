import { HeaderProps } from '@/types/header';

export const PageHeader = (props: HeaderProps) => {
  return (
    <div class="h-24 flex flex-col">
      <div class="flex flex-row flex-1 items-center">
        <h1 class="flex-1 text-2xl font-bold text-left">{props.title}</h1>
        {props.children}
      </div>
      <div class="divider mt-1"></div>
    </div>
  );
};
