import type { ListProps } from "react-virtualized";

declare const rowCount: number;
declare const rowRenderer: ListProps["rowRenderer"];
declare const width: number;

// <begin>

// react-virtualized 10
import { List } from "react-virtualized";

function Example() {
  return (
    <List
      rowCount={rowCount}
      rowHeight={30}
      rowRenderer={rowRenderer}
      scrollElement="window"
      width={width}
    />
  );
}

// <end>

export { Example };
