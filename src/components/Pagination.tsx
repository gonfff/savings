import { PaginatedContainerProps } from '@/types/pagination';
import { createEffect, createSignal, onCleanup, ParentProps } from 'solid-js';

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

  // fetch data on offset reload
  createEffect(() => {
    if (props.offset() === 0 && props.items() === null) {
      props.fetchFunction(props.limit, props.offset()).then((data) => {
        props.setItems(data.items);
        setNextPage(data.next);
      });
    }
  });

  // render children with container reference for scroll event
  return (
    <div ref={container} class="overflow-y-auto h-full">
      {props.children}
    </div>
  );
};
