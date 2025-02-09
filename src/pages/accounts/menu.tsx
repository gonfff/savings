import { fetchAccountsBy } from '@/core/accounts';
import { fetchLocations } from '@/core/locations';
import { compactNumber } from '@/helpers/compact-number';
import { AccountMenuSelection, AccountsFilter } from '@/types/accounts';
import { Location } from '@/types/locations';
import { createEffect, createResource, createSignal, For } from 'solid-js';

export const AccountsMenu = (props: AccountMenuSelection) => {
  const [locations, setLocations] = createSignal<Location[]>([]);
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
                    <p class="whitespace-nowrap">{compactNumber(1213.123)}</p>
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
            <div class="flex flex-col">
              <p>{account.asset_code}</p>
              <p class="whitespace-nowrap">{compactNumber(1213.123)}</p>
            </div>
          </a>
        </li>
      )}
    </For>
  );
};
