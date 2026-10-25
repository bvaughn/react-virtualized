import { LIST } from "../../../utils/data";

const list = LIST;

const BUTTON_CLASS_NAME =
  "cursor-pointer whitespace-nowrap rounded border border-ink/15 bg-ink/5 px-2 py-1 text-sm hover:bg-ink/10";
const INPUT_CLASS_NAME =
  "w-24 rounded border border-ink/15 bg-paper px-2 py-1 text-sm";
const LABEL_CLASS_NAME = "flex flex-col gap-1 text-sm";

// <begin>

import { useRef, useState, type FormEvent } from "react";
import {
  Column,
  Table,
  type Alignment,
  type TableImperativeAPI
} from "react-virtualized";
import { AutoSizer } from "react-virtualized-auto-sizer";

function Example() {
  const tableRef = useRef<TableImperativeAPI>(null);

  const [align, setAlign] = useState<Alignment>("center");
  const [index, setIndex] = useState("500");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    tableRef.current?.scrollToRow({ align, index: parseInt(index, 10) });
  };

  const scrollToTop = () => {
    tableRef.current?.scrollToPosition({ scrollTop: 0 });
  };

  return (
    <div className="flex flex-col gap-2">
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
        <button
          className={BUTTON_CLASS_NAME}
          onClick={scrollToTop}
          type="button"
        >
          Scroll to top
        </button>
      </form>
      <AutoSizer
        renderProp={({ width }) =>
          width !== undefined ? (
            <Table
              headerHeight={30}
              height={200}
              ref={tableRef}
              rowClassName="border-b border-ink/10"
              rowCount={list.length}
              rowGetter={({ index }) => list[index]}
              rowHeight={30}
              width={width}
            >
              <Column dataKey="index" label="Index" width={60} />
              <Column dataKey="name" flexGrow={1} label="Name" width={120} />
            </Table>
          ) : null
        }
      />
    </div>
  );
}

// <end>

export { Example as TableImperativeMethods };
