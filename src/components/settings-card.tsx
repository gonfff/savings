import { SettingsCardProps } from '@/types/settings';

export const SettingsCard = (props: SettingsCardProps) => {
  return (
    <div class="card w-full shadow-md border">
      <div class="card-body">
        <h2 class="card-title">{props.title}</h2>
        <p class="text-sm opacity-50">{props.description}</p>
        {props.children}
      </div>
    </div>
  );
};
