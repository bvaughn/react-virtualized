import type {
  CellRendererParams,
  OverscanIndicesGetter
} from "react-virtualized";
import { LIST as list } from "../../../utils/data";

function cellRenderer({
  columnIndex,
  key,
  rowIndex,
  style
}: CellRendererParams) {
  const item = list[rowIndex % list.length];

  return (
    <div
      className={[
        "flex items-center truncate border-b border-white/10 px-2",
        rowIndex % 2 === 1 ? "bg-white/5" : ""
      ].join(" ")}
      key={key}
      style={style}
    >
      {columnIndex === 0 ? `Row ${rowIndex}` : item.name}
    </div>
  );
}

// <begin>

import { Grid, type RenderedSection } from "react-virtualized";

function OverscanDemo({
  onSectionRendered,
  overscanIndicesGetter,
  overscanRowCount,
  width
}: {
  onSectionRendered: (section: RenderedSection) => void;
  overscanIndicesGetter: OverscanIndicesGetter;
  overscanRowCount: number;
  width: number;
}) {
  return (
    <Grid
      cellRenderer={cellRenderer}
      columnCount={2}
      columnWidth={width / 2}
      height={200}
      // Reports both the visible and the rendered (overscanned) ranges
      onSectionRendered={onSectionRendered}
      overscanIndicesGetter={overscanIndicesGetter}
      overscanRowCount={overscanRowCount}
      rowCount={1000}
      rowHeight={30}
      width={width}
    />
  );
}

// <end>

export { OverscanDemo };
