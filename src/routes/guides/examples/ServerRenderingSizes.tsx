import type { ListProps } from "react-virtualized";

type RowRenderer = ListProps["rowRenderer"];

// <begin>

import { List } from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

// Sizes to render with on the server (e.g. a typical viewport),
// before AutoSizer has measured the available space
const SERVER_HEIGHT = 600;
const SERVER_WIDTH = 800;

function Example({
  rowCount,
  rowRenderer
}: {
  rowCount: number;
  rowRenderer: RowRenderer;
}) {
  return (
    <AutoSizer
      renderProp={({ height = SERVER_HEIGHT, width = SERVER_WIDTH }) => (
        <List
          height={height}
          rowCount={rowCount}
          rowHeight={30}
          rowRenderer={rowRenderer}
          width={width}
        />
      )}
    />
  );
}

// <end>

export { Example };
