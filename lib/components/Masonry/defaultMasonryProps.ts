import { DEFAULT_SCROLLING_RESET_TIME_INTERVAL } from "./constants";
import type { MasonryProps } from "./types";

type DefaultedPropKeys =
  | "keyMapper"
  | "onCellsRendered"
  | "onScroll"
  | "overscanByPixels"
  | "role"
  | "rowDirection"
  | "scrollingResetTimeInterval"
  | "style"
  | "tabIndex";

const noop = () => {};

/**
 * Default values for `Masonry`'s optional props.
 * (The PURE annotations let bundlers drop this object if it isn't used.)
 */
export const defaultMasonryProps: Readonly<{
  [Key in DefaultedPropKeys]-?: NonNullable<MasonryProps[Key]>;
}> = /* @__PURE__ */ Object.freeze({
  keyMapper: (index: number) => index,
  onCellsRendered: noop,
  onScroll: noop,
  overscanByPixels: 20,
  role: "grid",
  rowDirection: "ltr",
  scrollingResetTimeInterval: DEFAULT_SCROLLING_RESET_TIME_INTERVAL,
  style: /* @__PURE__ */ Object.freeze({}),
  tabIndex: 0
});
