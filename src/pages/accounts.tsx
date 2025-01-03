import { TableRowButton } from '@/components/buttons';
import { createSignal, For } from 'solid-js';

const AccountsPage = () => {
  return (
    <div class="flex flex-col mr-3 mt-3 h-screen">
      <AccountsHeader />
      <AccountsContent />
    </div>
  );
};

export default AccountsPage;

const AccountsHeader = () => {
  return (
    <div class="h-24 flex flex-col">
      <div class="flex flex-row flex-1 items-center">
        <h1 class="flex-1 text-2xl font-bold text-left">Accounts</h1>
        <div class="space-x-2">
          <AddTransactionButton />
          <AddAccountButton />
        </div>
      </div>
      <div class="divider mt-1"></div>
    </div>
  );
};

const AccountsContent = () => {
  return (
    <div class="h-full w-full grid grid-cols-[12rem_1fr]">
      <AccountsList />
      <AccountContent />
    </div>
  );
};

const AccountsList = () => {
  const [selectedMenu, setSelectedMenu] = createSignal('Dashboard');

  const handleMenuClick = (menu: string) => {
    setSelectedMenu(menu);
  };
  const accounts = [
    { id: 1, name: 'T-bank', balance: 1000 },
    { id: 2, name: 'Binance', balance: 2000 },
  ];

  return (
    <div class="h-full grid grid-cols-[11rem_1fr]">
      <div class="menu flex">
        <ul>
          <For each={accounts}>
            {(account) => (
              <li>
                <a
                  class={`menu-item rounded-none -ml-2 ${
                    selectedMenu() === account.name ? 'active' : ''
                  }`}
                  onClick={() => handleMenuClick(account.name)}
                >
                  <div class="grid grid-cols-2 grid-rows-2 w-32">
                    <div class="text-left">{account.name} </div>
                    <div class="text-right">{account.balance}</div>
                    <div class="text-left">USD</div>
                    <div class="text-right">0.00%</div>
                  </div>
                </a>
              </li>
            )}
          </For>
        </ul>
      </div>
      <div class="divider divider-horizontal -ml-1 -mr-2 -mt-3"></div>
    </div>
  );
};

const AccountContent = () => {
  return (
    <div class="flex flex-col">
      <div class="h-60 w-full content-center items-center text-center border">
        <p>chart here</p>
      </div>
      <table class="table table-zebra">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Account</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2021/10/01</td>
            <td>BUY</td>
            <td>1</td>
            <td>12,12</td>
            <td>Binance</td>
            <td>
              <TableRowButton editFunc={() => {}} deleteFunc={() => {}} />
            </td>
          </tr>
          <tr>
            <td>2021/10/02</td>
            <td>SELL</td>
            <td>2000</td>
            <td>2900</td>
            <td>Binance</td>
            <td>
              <TableRowButton editFunc={() => {}} deleteFunc={() => {}} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const AddTransactionButton = () => {
  return <button class="btn btn-primary">Add Transaction</button>;
};

const AddAccountButton = () => {
  return <button class="btn btn-primary">Add Account</button>;
};
