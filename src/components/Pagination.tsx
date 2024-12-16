import {
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  ParentProps,
} from 'solid-js';
import { PaginatedResponse } from '../services/base.types';

interface PaginatedContainerProps {
  items: () => any[] | null;
  setItems: (items: any[] | null) => void;
  fetchFunction: (
    limit: number,
    offset: number,
  ) => Promise<PaginatedResponse<any>>;
}

export const PaginatedContainer = (
  props: ParentProps<PaginatedContainerProps>,
) => {
  // div element reference for scroll event
  let container: HTMLDivElement | undefined;

  const [nextPage, setNextPage] = createSignal<boolean>(false);
  const [limit] = createSignal<number>(20);
  const [offset, setOffset] = createSignal<number>(0);

  // fetch next data and put it in the items signal
  const fetchNextData = async () => {
    if (nextPage()) {
      setOffset(offset() + limit());
      const data = await props.fetchFunction(limit(), offset());
      props.setItems([...(props.items() || []), ...data.items]);
    }
  };

  // fetch next data when user scrolls to the bottom of the container
  const handleScroll = () => {
    if (
      container &&
      container.scrollTop + container.clientHeight >= container.scrollHeight
    ) {
      fetchNextData();
    }
  };

  // add scroll event listener to the container
  createEffect(() => {
    if (container) {
      container.addEventListener('scroll', handleScroll);
      onCleanup(() => {
        container.removeEventListener('scroll', handleScroll);
      });
    }
  });

  // fetch data on mount
  onMount(async () => {
    const data = await props.fetchFunction(limit(), offset());
    props.setItems(data.items);
    setNextPage(data.next);
  });

  // render children with container reference for scroll event
  return (
    <div ref={container} class="overflow-y-auto">
      {props.children}
    </div>
  );
};
