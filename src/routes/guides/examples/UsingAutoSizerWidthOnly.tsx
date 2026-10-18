import type { ListProps } from "react-virtualized";

type RowRenderer = ListProps["rowRenderer"];

// <begin>

import { List } from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

function Example({
  rowCount,
  rowRenderer
}: {
  rowCount: number;
  rowRenderer: RowRenderer;
}) {
  return (
    <AutoSizer
      renderProp={({ width }) =>
        // Only the width is used; the list has a fixed height
        width !== undefined ? (
          <List
            height={200}
            rowCount={rowCount}
            rowHeight={30}
            rowRenderer={rowRenderer}
            width={width}
          />
        ) : null
      }
    />
  );
}

// <end>

export { Example };
