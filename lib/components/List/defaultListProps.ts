import { accessibilityOverscanIndicesGetter } from "../Grid/accessibilityOverscanIndicesGetter";
import type { ListProps } from "./types";

type DefaultedPropKeys =
  | "estimatedRowSize"
  | "noRowsRenderer"
  | "onRowsRendered"
  | "onScroll"
  | "overscanIndicesGetter"
  | "overscanRowCount"
  | "role"
  | "style"
  | "tabIndex";

const noop = () => {};

/**
 * Default values for `List`'s optional props.
 * (The PURE annotations let bundlers drop this object if it isn't used.)
 */
export const defaultListProps: Readonly<
  Required<Pick<ListProps, DefaultedPropKeys>>
> = /* @__PURE__ */ Object.freeze({
  estimatedRowSize: 30,
  noRowsRenderer: () => null,
  onRowsRendered: noop,
  onScroll: noop,
  overscanIndicesGetter: accessibilityOverscanIndicesGetter,
  overscanRowCount: 10,
  role: "list",
  style: /* @__PURE__ */ Object.freeze({}),
  tabIndex: 0
});
