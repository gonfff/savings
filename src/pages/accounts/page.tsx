import { AccountsPageHeader } from '@/pages/accounts/header';
import { AccountsPageContent } from './content';
import { createSignal } from 'solid-js';

const AccountsPage = () => {
  const [selectedLocation, setSelectedLocation] = createSignal<number>(0);
  const [selectedAccount, setSelectedAccount] = createSignal<number>(0);
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
