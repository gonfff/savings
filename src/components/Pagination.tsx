import {
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  ParentProps,
} from 'solid-js';
import { PaginatedResponse } from '../services/base.types';

interface PaginatedContainerProps {
  limit: number;
  offset: () => number;
  setOffset: (offset: number) => void;
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

  // fetch next data and put it in the items signal
  const fetchNextData = async () => {
    if (nextPage()) {
      props.setOffset(props.offset() + props.limit);
      const data = await props.fetchFunction(props.limit, props.offset());
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

  const initialFetch = async () => {
    const data = await props.fetchFunction(props.limit, props.offset());
    props.setItems(data.items);
    setNextPage(data.next);
  };

  // fetch data on mount
  onMount(async () => {
    await initialFetch();
  });

  // fetch data on offset reload
  createEffect(() => {
    if (props.offset() === 0 && props.items() === null) {
      initialFetch();
    }
  });

  // render children with container reference for scroll event
  return (
    <div ref={container} class="overflow-y-auto">
      {props.children}
    </div>
  );
};
