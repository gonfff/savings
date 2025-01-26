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
  const fetchLocationAccounts = async (locationId: number) => {
    // fetch accounts for a location
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

  createEffect(() => {
    // fetch all locations on page load
    fetchAllLocations();
  });

  const handleLocationClick = (value: number) => {
    if (props.selectedLocation() === value) {
      props.setSelectedLocation(0);
    } else {
      props.setSelectedLocation(value);
    }
  };
  const handleAccountClick = (value: number) => {
    if (props.selectedAccount() === value) {
      props.setSelectedAccount(0);
    } else {
      props.setSelectedAccount(value);
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
                  <p class="w-30 fade-text">{location.name}</p>
                </a>
                <ul
                  class={`menu-dropdown ${location.id === props.selectedLocation() ? 'menu-dropdown-show' : ''}`}
                >
                  <For each={accounts()}>
                    {(account) => (
                      <li>
                        <a
                          class={`menu-item rounded-none w-full ${
                            props.selectedAccount() === account.id
                              ? 'active'
                              : ''
                          }`}
                          onClick={() => handleAccountClick(account.id)}
                        >
                          <div class="grid grid-cols-2 content-between">
                            <div class="w-28 col-span-2 fade-text">
                              {account.name}
                            </div>
                            <div
                              class={`col-span-2 flex ${compactNumber(12312312).length > 7 ? 'flex-col' : 'flex-row'} justify-between`}
                            >
                              <div class="text-left whitespace-nowrap">
                                {account.asset_code}
                              </div>

                              <div class="text-right whitespace-nowrap">
                                {compactNumber(12312312)}
                              </div>
                            </div>
                          </div>
                        </a>
                      </li>
                    )}
                  </For>
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
