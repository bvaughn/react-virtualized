import { LIST as items } from "../../../utils/data";

// <begin>

import { List, type RowRendererParams } from "react-virtualized";
import {
  AutoSizer,
  type AutoSizerChildProps
} from "react-virtualized-auto-sizer";

function rowRenderer({ index, key, style }: RowRendererParams) {
  return (
    <div className="flex items-center px-2" key={key} style={style}>
      {items[index].name}
    </div>
  );
}

// Define the child component outside of render so that it isn't re-created
// (use renderProp instead if the list needs access to local state or props)
function SizedList({ height, width }: AutoSizerChildProps) {
  if (height === undefined || width === undefined) {
    // Not measured yet (e.g. the first render, or during server rendering)
    return null;
  }

  return (
    <List
      height={height}
      rowCount={items.length}
      rowHeight={30}
      rowRenderer={rowRenderer}
      width={width}
    />
  );
}

function Example() {
  return <AutoSizer ChildComponent={SizedList} />;
}

// <end>

export { Example };
