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
    <div style={{ display: "flex", height: "100%" }}>
      {/* Other children... */}
      {/* AutoSizer measures this element; min-width/min-height let it shrink below the list's size */}
      <div style={{ flex: "1 1 auto", minHeight: 0, minWidth: 0 }}>
        <AutoSizer
          renderProp={({ height, width }) =>
            height !== undefined && width !== undefined ? (
              <List
                height={height}
                rowCount={rowCount}
                rowHeight={30}
                rowRenderer={rowRenderer}
                width={width}
              />
            ) : null
          }
        />
      </div>
    </div>
  );
}

// <end>

export { Example };
