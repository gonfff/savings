import { DotSymbol } from '@/components/consts';
import { fetchAccountsBy } from '@/core/accounts';
import { fetchLocations } from '@/core/locations';
import { compactNumber } from '@/helpers/compact-number';
import {
  AccountBalance,
  AccountMenuSelection,
  AccountsFilter,
} from '@/types/accounts';
import { LocationBalance } from '@/types/locations';
import {
  createEffect,
  createResource,
  createSignal,
  For,
  Show,
} from 'solid-js';

export const AccountsMenu = (props: AccountMenuSelection) => {
  const [locations, setLocations] = createSignal<LocationBalance[]>([]);
  const limit = 100; // todo: avoid hardcoding and add pagination

  const fetchAllLocations = async () => {
    const result = await fetchLocations(limit);
    setLocations(result.items);
  };
  createEffect(() => {
    // fetch all locations on page load
    fetchAllLocations();
  });

  const handleLocationClick = (value: number) => {
    if (props.selectedLocation() === value) {
      props.setSelectedLocation(0);
      props.setSelectedAccount(0);
    } else {
      props.setSelectedLocation(value);
      props.setSelectedAccount(0);
    }
  };

  return (
    <div class="max-h-full grid grid-cols-[11rem_1fr] overflow-hidden">
      <div class="menu overflow-y-auto overflow-x-hidden">
        <ul>
          <For each={locations()}>
            {(location) => (
              <li>
                <a
                  class={`menu-dropdown-toggle -ml-2
                  ${location.id === props.selectedLocation() ? 'menu-dropdown-show active' : ''}
                  rounded-none`}
                  onClick={() => handleLocationClick(location.id)}
                >
                  <div class="flex flex-col">
                    <p class="w-30 fade-text">{location.name}</p>
                    <div class="flex flex-row fade-text text-xs flex justify-between">
                      <p>
                        {compactNumber(location.total_balance || 0)}
                        {DotSymbol}
                        {location.base_asset_name}
                      </p>
                    </div>
                  </div>
                </a>
                <ul
                  class={`menu-dropdown ${location.id === props.selectedLocation() ? 'menu-dropdown-show' : ''}`}
                >
                  <LocationAccountsSubMenu {...props} />
                </ul>
              </li>
            )}
          </For>
        </ul>
      </div>
      <div class="divider divider-horizontal -ml-1 -mr-2 -mt-3"></div>
    </div>
  );
};

const LocationAccountsSubMenu = (props: AccountMenuSelection) => {
  const limit = 100; // todo: avoid hardcoding and add pagination

  const fetchLocationAccounts = async (locationId: number) => {
    const result = await fetchAccountsBy(
      { location_id: locationId } as AccountsFilter,
      limit,
    );
    return result.items;
  };

  const [accounts] = createResource(
    props.selectedLocation,
    fetchLocationAccounts,
  );

  const handleAccountClick = (value: number) => {
    if (props.selectedAccount() === value) {
      props.setSelectedAccount(0);
    } else {
      props.setSelectedAccount(value);
    }
  };

  return (
    <For each={accounts()}>
      {(account) => (
        <li>
          <a
            class={`menu-item rounded-none w-full ${
              props.selectedAccount() === account.id ? 'active' : ''
            }`}
            onClick={() => handleAccountClick(account.id)}
          >
            <Show
              when={account.name}
              fallback={<AccountMenuRow {...account} />}
            >
              <AccountMenuRowWithName {...account} />
            </Show>
          </a>
        </li>
      )}
    </For>
  );
};

const AccountMenuRowWithName = (account: AccountBalance) => {
  return (
    <div class="flex flex-col w-24">
      <div class="fade-text">{account.name}</div>
      <div class="flex flex-row fade-text text-xs flex justify-between">
        {compactNumber(account.balance)}
        {DotSymbol}
        {account.asset_code}
      </div>
    </div>
  );
};

const AccountMenuRow = (account: AccountBalance) => {
  return (
    <div class="flex flex-col w-24">
      <div class="fade-text">{account.asset_code}</div>
      <div class="flex flex-row fade-text text-xs flex justify-between">
        {compactNumber(account.balance)}
      </div>
    </div>
  );
};
