import { defaultCellDataGetter } from "./defaultCellDataGetter";
import { defaultCellRenderer } from "./defaultCellRenderer";
import { defaultHeaderRenderer } from "./defaultHeaderRenderer";
import { SortDirection } from "./SortDirection";
import type { ColumnProps } from "./types";

type DefaultedPropKeys =
  | "cellDataGetter"
  | "cellRenderer"
  | "defaultSortDirection"
  | "flexGrow"
  | "flexShrink"
  | "headerRenderer"
  | "style";

/** Column props, with the props that have default values marked as required. */
export type ColumnPropsWithDefaults = ColumnProps &
  Required<Pick<ColumnProps, DefaultedPropKeys>>;

/**
 * Default values for `Column`'s optional props.
 * `Table` applies these to the props of each of its child elements (so wrapper components work as columns too).
 * (The PURE annotations let bundlers drop this object if it isn't used.)
 */
export const defaultColumnProps: Readonly<
  Required<Pick<ColumnProps, DefaultedPropKeys>>
> = /* @__PURE__ */ Object.freeze({
  cellDataGetter: defaultCellDataGetter,
  cellRenderer: defaultCellRenderer,
  defaultSortDirection: SortDirection.ASC,
  flexGrow: 0,
  flexShrink: 1,
  headerRenderer: defaultHeaderRenderer,
  style: /* @__PURE__ */ Object.freeze({})
});
