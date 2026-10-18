import { LIST, type ListItem } from "../../../utils/data";
import { InfiniteLoadingList } from "./InfiniteLoadingList";

// Simulate a network request for a page of items
async function fetchPage(startIndex: number, pageSize: number) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return LIST.slice(startIndex, startIndex + pageSize);
}

// <begin>

import { useState } from "react";

const PAGE_SIZE = 25;
const MAX_ITEMS = 250;

function InfiniteLoadingListDemo() {
  const [items, setItems] = useState<ListItem[]>([]);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);

  const hasNextPage = items.length < MAX_ITEMS;

  const loadNextPage = async () => {
    setIsNextPageLoading(true);

    const page = await fetchPage(items.length, PAGE_SIZE);

    setItems((prevItems) => [...prevItems, ...page]);
    setIsNextPageLoading(false);
  };

  return (
    <InfiniteLoadingList
      hasNextPage={hasNextPage}
      isNextPageLoading={isNextPageLoading}
      items={items}
      loadNextPage={loadNextPage}
    />
  );
}

// <end>

export { InfiniteLoadingListDemo };
