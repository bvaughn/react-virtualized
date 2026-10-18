import type { ListProps } from "react-virtualized";

type RowRenderer = ListProps["rowRenderer"];

// <begin>

import { List } from "react-virtualized";

function Example({
  rowCount,
  rowRenderer,
  savedScrollTop
}: {
  rowCount: number;
  rowRenderer: RowRenderer;
  // E.g. restored from the URL or from session storage
  savedScrollTop: number;
}) {
  return (
    <List
      height={300}
      // Rendered (on the server too) and scrolled to when the List mounts;
      // changing it later has no effect
      initialScrollTop={savedScrollTop}
      rowCount={rowCount}
      rowHeight={30}
      rowRenderer={rowRenderer}
      width={600}
    />
  );
}

// <end>

export { Example };
