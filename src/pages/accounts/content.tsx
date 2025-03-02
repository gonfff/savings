import { TableRowButton } from '@/components/buttons';
import { AccountMenuSelection } from '@/types/accounts';
import { createSignal } from 'solid-js';
import { AccountsMenu } from './menu';
import { DotSymbol } from '@/components/consts';

export const AccountsPageContent = (props: AccountMenuSelection) => {
  return (
    <div class="flex-1 overflow-hidden grid grid-cols-[12rem_1fr]">
      <AccountsMenu {...props} />
      <AccountContent {...props} />
    </div>
  );
};

const AccountContent = (props: AccountMenuSelection) => {
  const [selectedMenu, setSelectedMenu] = createSignal('All');
  return (
    <div class="flex flex-col items-center">
      <div class="flex flex-row w-full text-left mb-3">
        <p class="opacity-50 text-sm">
          Это мой очередной сберегательный счет раздва три хуйхуйхуй
        </p>
      </div>
      <div class="flex flex-row text-sm text-gray-500 whitespace-nowrap mb-3">
        <div>
          <p>1.2{DotSymbol}1024$</p>
        </div>
        <div class="divider divider-horizontal"></div>
        <div class="text-red-500">
          <p>-123.12${DotSymbol}10.1%</p>
        </div>
      </div>
      <div class="h-80 w-full flex flex-col justify-between border">
        <div class="h-full w-full text-center content-center items-center">
          <p>chart here</p>
        </div>

        <div class="flex flex-row justify-center w-full menu menu-xs">
          <li>
            <a
              class={`rounded-none menu-item ${
                selectedMenu() === '1w' ? 'active' : ''
              }`}
              onClick={() => {}}
            >
              1w
            </a>
          </li>
          <li>
            <a
              class={`rounded-none menu-item  ${
                selectedMenu() === '1m' ? 'active' : ''
              }`}
              onClick={() => {}}
            >
              1m
            </a>
          </li>
          <li>
            <a
              class={`rounded-none menu-item ${
                selectedMenu() === '1y' ? 'active' : ''
              }`}
              onClick={() => {}}
            >
              1y
            </a>
          </li>
          <li>
            <a
              class={`rounded-none menu-item ${
                selectedMenu() === 'All' ? 'active' : ''
              }`}
              onClick={() => {}}
            >
              All
            </a>
          </li>
        </div>
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
