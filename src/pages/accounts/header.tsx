import { PageHeader } from '@/components/header';
import { AccountMenuSelection } from '@/types/accounts';

export const AccountsPageHeader = (props: AccountMenuSelection) => {
  return (
    <PageHeader title="Accounts">
      <AddTransactionButton />
    </PageHeader>
  );
};

const AddTransactionButton = () => {
  return <button class="btn btn-primary">Add Transaction</button>;
};
