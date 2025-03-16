import { AccountsPageHeader } from '@/pages/accounts/header';
import { AccountMenuSelection } from '@/types/accounts';
import { createSignal } from 'solid-js';
import { AccountContent } from './content';
import { AccountsMenu } from './menu';

const AccountsPage = () => {
  const [selectedLocation, setSelectedLocation] = createSignal<number>(1);
  const [selectedAccount, setSelectedAccount] = createSignal<number>(1);
  const selection = {
    selectedLocation,
    selectedAccount,
    setSelectedLocation,
    setSelectedAccount,
  };

  return (
    <div class="flex flex-col mr-3 mt-3 h-screen">
      <AccountsPageHeader {...selection} />
      <AccountsPageContent {...selection} />
    </div>
  );
};

export default AccountsPage;

const AccountsPageContent = (props: AccountMenuSelection) => {
  return (
    <div class="flex-1 overflow-hidden grid grid-cols-[12rem_1fr]">
      <AccountsMenu {...props} />
      <AccountContent {...props} />
    </div>
  );
};
