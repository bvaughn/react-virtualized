// <begin>

import { List } from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

function noRowsRenderer() {
  return (
    <div className="h-full flex items-center justify-center text-slate-500">
      No rows
    </div>
  );
}

function Example() {
  return (
    <AutoSizer
      renderProp={({ height, width }) =>
        height !== undefined && width !== undefined ? (
          <List
            height={height}
            noRowsRenderer={noRowsRenderer}
            rowCount={0}
            rowHeight={35}
            rowRenderer={() => null}
            width={width}
          />
        ) : null
      }
    />
  );
}

// <end>

export { Example as ListNoRows };
