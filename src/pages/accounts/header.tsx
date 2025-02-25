import { PageHeader } from '@/components/header';
import { AccountMenuSelection } from '@/types/accounts';

export const AccountsPageHeader = (props: AccountMenuSelection) => {
  return (
    <PageHeader title="Accounts">
      <AddTransactionButton {...props} />
    </PageHeader>
  );
};

const AddTransactionButton = (props: AccountMenuSelection) => {
  return (
    <button
      class={`btn btn-primary ${props.selectedAccount() ? '' : 'btn-disabled'}`}
    >
      Add Transaction
    </button>
  );
};
