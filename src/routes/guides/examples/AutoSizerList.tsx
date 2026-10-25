import type { ListItem } from "../../../utils/data";

// <begin>

import { List, type RowRendererParams } from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

function Example({ items }: { items: ListItem[] }) {
  const rowRenderer = ({ index, key, style }: RowRendererParams) => (
    <div
      className={
        index % 2 ? "flex items-center px-2" : "flex items-center px-2 bg-ink/5"
      }
      key={key}
      style={style}
    >
      {items[index].name}
    </div>
  );

  return (
    <AutoSizer
      renderProp={({ height, width }) =>
        height !== undefined && width !== undefined ? (
          <List
            height={height}
            rowCount={items.length}
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
