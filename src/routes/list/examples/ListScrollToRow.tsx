import { LIST } from "../../../utils/data";

const list = LIST;

const BUTTON_CLASS_NAME =
  "cursor-pointer whitespace-nowrap rounded border border-white/15 bg-white/5 px-2 py-1 text-sm hover:bg-white/10";
const INPUT_CLASS_NAME =
  "w-24 rounded border border-white/15 bg-slate-900 px-2 py-1 text-sm";
const LABEL_CLASS_NAME = "flex flex-col gap-1 text-sm";

// <begin>

import { useRef, useState, type FormEvent } from "react";
import {
  List,
  type Alignment,
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

  const [align, setAlign] = useState<Alignment>("auto");
  const [index, setIndex] = useState("500");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    listRef.current?.scrollToRow({ align, index: parseInt(index, 10) });
  };

  return (
    <div className="h-full flex flex-col gap-2">
      <form className="flex flex-wrap items-end gap-2" onSubmit={onSubmit}>
        <label className={LABEL_CLASS_NAME}>
          Row
          <input
            className={INPUT_CLASS_NAME}
            max={list.length - 1}
            min={0}
            onChange={(event) => setIndex(event.target.value)}
            required
            type="number"
            value={index}
          />
        </label>
        <label className={LABEL_CLASS_NAME}>
          Alignment
          <select
            className={INPUT_CLASS_NAME}
            onChange={(event) => setAlign(event.target.value as Alignment)}
            value={align}
          >
            <option value="auto">auto</option>
            <option value="start">start</option>
            <option value="center">center</option>
            <option value="end">end</option>
          </select>
        </label>
        <button className={BUTTON_CLASS_NAME} type="submit">
          Scroll
        </button>
      </form>
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

export { Example as ListScrollToRow };
