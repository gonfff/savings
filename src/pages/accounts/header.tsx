import { TableRowButton } from '@/components/buttons';

export const AccountsPageHeader = () => {
  return (
    <div class="h-24 flex flex-col">
      <div class="flex flex-row flex-1 items-center">
        <h1 class="flex-1 text-2xl font-bold text-left">Accounts</h1>
        <div class="space-x-2">
          <AddTransactionButton />
          <AddAccountButton />
          <AddBurgerButton />
        </div>
      </div>
      <div class="divider mt-1"></div>
    </div>
  );
};

const AddTransactionButton = () => {
  return <button class="btn btn-primary">Add Transaction</button>;
};

const AddAccountButton = () => {
  return <button class="btn btn-primary">Add Account</button>;
};

const AddBurgerButton = () => {
  return <TableRowButton editFunc={() => {}} deleteFunc={() => {}} />;
};
