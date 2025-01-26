import { AccountContent } from '@/pages/accounts/content';
import { AccountsPageHeader } from '@/pages/accounts/header';
import { AccountsMenu } from '@/pages/accounts/menu';
import { createSignal } from 'solid-js';

const AccountsPage = () => {
  return (
    <div class="flex flex-col mr-3 mt-3 h-screen">
      <AccountsPageHeader />
      <AccountsPageContent />
    </div>
  );
};

export default AccountsPage;

const AccountsPageContent = () => {
  const [selectedLocation, setSelectedLocation] = createSignal<number>(0);
  const [selectedAccount, setSelectedAccount] = createSignal<number>(0);
  const selection = {
    selectedLocation,
    selectedAccount,
    setSelectedLocation,
    setSelectedAccount,
  };

  return (
    <div class="flex-1 overflow-hidden grid grid-cols-[12rem_1fr]">
      <AccountsMenu {...selection} />
      <AccountContent {...selection} />
    </div>
  );
};
