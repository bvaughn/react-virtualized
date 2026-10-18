import scrollbarSize from "dom-helpers/scrollbarSize";
import { DEFAULT_SCROLLING_RESET_TIME_INTERVAL } from "./constants";
import { defaultCellRangeRenderer } from "./defaultCellRangeRenderer";
import { defaultOverscanIndicesGetter } from "./defaultOverscanIndicesGetter";
import type { GridProps } from "./types";

type DefaultedPropKeys =
  | "aria-label"
  | "aria-readonly"
  | "autoContainerWidth"
  | "cellRangeRenderer"
  | "containerRole"
  | "containerStyle"
  | "estimatedColumnSize"
  | "estimatedRowSize"
  | "getScrollbarSize"
  | "isScrollingOptOut"
  | "noContentRenderer"
  | "onScroll"
  | "onScrollbarPresenceChange"
  | "onSectionRendered"
  | "overscanColumnCount"
  | "overscanIndicesGetter"
  | "overscanRowCount"
  | "role"
  | "scrollingResetTimeInterval"
  | "style"
  | "tabIndex";

const noop = () => {};

/**
 * Default values for `Grid`'s optional props.
 * (The PURE annotations let bundlers drop this object if it isn't used.)
 */
export const defaultGridProps: Readonly<
  Required<Pick<GridProps, DefaultedPropKeys>>
> = /* @__PURE__ */ Object.freeze({
  "aria-label": "grid",
  "aria-readonly": true,
  autoContainerWidth: false,
  cellRangeRenderer: defaultCellRangeRenderer,
  containerRole: "row",
  containerStyle: /* @__PURE__ */ Object.freeze({}),
  estimatedColumnSize: 100,
  estimatedRowSize: 30,
  getScrollbarSize: scrollbarSize,
  isScrollingOptOut: false,
  noContentRenderer: () => null,
  onScroll: noop,
  onScrollbarPresenceChange: noop,
  onSectionRendered: noop,
  overscanColumnCount: 0,
  overscanIndicesGetter: defaultOverscanIndicesGetter,
  overscanRowCount: 10,
  role: "grid",
  scrollingResetTimeInterval: DEFAULT_SCROLLING_RESET_TIME_INTERVAL,
  style: /* @__PURE__ */ Object.freeze({}),
  tabIndex: 0
});
