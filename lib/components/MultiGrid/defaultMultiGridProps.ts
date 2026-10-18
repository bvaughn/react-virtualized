import type { MultiGridProps } from "./types";

type DefaultedPropKeys =
  | "classNameBottomLeftGrid"
  | "classNameBottomRightGrid"
  | "classNameTopLeftGrid"
  | "classNameTopRightGrid"
  | "enableFixedColumnScroll"
  | "enableFixedRowScroll"
  | "fixedColumnCount"
  | "fixedRowCount"
  | "hideBottomLeftGridScrollbar"
  | "hideTopRightGridScrollbar"
  | "style"
  | "styleBottomLeftGrid"
  | "styleBottomRightGrid"
  | "styleTopLeftGrid"
  | "styleTopRightGrid";

/**
 * Default values for `MultiGrid`'s optional props.
 * (Props that are relayed to the inner `Grid`s default to the values in `defaultGridProps`.)
 */
export const defaultMultiGridProps: Readonly<
  Required<Pick<MultiGridProps, DefaultedPropKeys>>
> = /* @__PURE__ */ Object.freeze({
  classNameBottomLeftGrid: "",
  classNameBottomRightGrid: "",
  classNameTopLeftGrid: "",
  classNameTopRightGrid: "",
  enableFixedColumnScroll: false,
  enableFixedRowScroll: false,
  fixedColumnCount: 0,
  fixedRowCount: 0,
  hideBottomLeftGridScrollbar: false,
  hideTopRightGridScrollbar: false,
  style: /* @__PURE__ */ Object.freeze({}),
  styleBottomLeftGrid: /* @__PURE__ */ Object.freeze({}),
  styleBottomRightGrid: /* @__PURE__ */ Object.freeze({}),
  styleTopLeftGrid: /* @__PURE__ */ Object.freeze({}),
  styleTopRightGrid: /* @__PURE__ */ Object.freeze({})
});
