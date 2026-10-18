import { accessibilityOverscanIndicesGetter } from "../Grid/accessibilityOverscanIndicesGetter";
import { defaultHeaderRowRenderer } from "./defaultHeaderRowRenderer";
import { defaultRowRenderer } from "./defaultRowRenderer";
import type { TableProps } from "./types";

type DefaultedPropKeys =
  | "disableHeader"
  | "estimatedRowSize"
  | "headerHeight"
  | "headerRowRenderer"
  | "headerStyle"
  | "noRowsRenderer"
  | "onRowsRendered"
  | "onScroll"
  | "overscanIndicesGetter"
  | "overscanRowCount"
  | "rowRenderer"
  | "rowStyle"
  | "style";

/**
 * Default values for `Table`'s optional props.
 * (The PURE annotations let bundlers drop this object if it isn't used.)
 */
export const defaultTableProps: Readonly<
  Required<Pick<TableProps, DefaultedPropKeys>>
> = /* @__PURE__ */ Object.freeze({
  disableHeader: false,
  estimatedRowSize: 30,
  headerHeight: 0,
  headerRowRenderer: defaultHeaderRowRenderer,
  headerStyle: /* @__PURE__ */ Object.freeze({}),
  noRowsRenderer: () => null,
  onRowsRendered: () => null,
  onScroll: () => null,
  overscanIndicesGetter: accessibilityOverscanIndicesGetter,
  overscanRowCount: 10,
  rowRenderer: defaultRowRenderer,
  rowStyle: /* @__PURE__ */ Object.freeze({}),
  style: /* @__PURE__ */ Object.freeze({})
});
