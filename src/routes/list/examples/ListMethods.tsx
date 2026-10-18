import { LIST } from "../../../utils/data";

const list = LIST;

const buttonClassName =
  "px-2 py-1 rounded border border-white/15 bg-white/5 hover:bg-white/10 cursor-pointer";

// <begin>

import { useRef } from "react";
import {
  List,
  type ListImperativeAPI,
  type RowRendererParams
} from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

function rowRenderer({ index, key, style }: RowRendererParams) {
  return (
    <div
      className="flex items-center justify-between px-4 border-b border-white/10"
      key={key}
      style={style}
    >
      {list[index].name}
      <div className="text-xs text-slate-500">Row {index}</div>
    </div>
  );
}

function Example() {
  const listRef = useRef<ListImperativeAPI>(null);

  return (
    <div className="h-full flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          className={buttonClassName}
          onClick={() => listRef.current?.scrollToRow({ index: 0 })}
        >
          Scroll to first row
        </button>
        <button
          className={buttonClassName}
          onClick={() =>
            listRef.current?.scrollToRow({ align: "center", index: 500 })
          }
        >
          Center row 500
        </button>
        <button
          className={buttonClassName}
          onClick={() =>
            listRef.current?.scrollToRow({ index: list.length - 1 })
          }
        >
          Scroll to last row
        </button>
      </div>
      <div className="grow">
        <AutoSizer
          renderProp={({ height, width }) =>
            height !== undefined && width !== undefined ? (
              <List
                height={height}
                ref={listRef}
                rowCount={list.length}
                rowHeight={35}
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

export { Example as ListMethods };
