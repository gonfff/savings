import { AccountsPageHeader } from '@/pages/accounts/header';
import { AccountsPageContent } from './content';

const AccountsPage = () => {
  return (
    <div class="flex flex-col mr-3 mt-3 h-screen">
      <AccountsPageHeader />
      <AccountsPageContent />
    </div>
  );
};

export default AccountsPage;
