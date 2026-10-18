import clsx from "clsx";
import {
  Children,
  forwardRef,
  isValidElement,
  memo,
  useCallback,
  useImperativeHandle,
  useInsertionEffect,
  useMemo,
  useState,
  type AriaAttributes,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode
} from "react";
import {
  createInnerGridRef,
  type InnerGridRef
} from "../../utils/createInnerGridRef";
import { useMissingHeightWarning } from "../../utils/scrollElement/useMissingHeightWarning";
import { useIsomorphicLayoutEffect } from "../../utils/useIsomorphicLayoutEffect";
import { Grid } from "../Grid/Grid";
import type {
  CellRenderer,
  CellRendererParams,
  GridProps,
  RenderedSection,
  Scroll
} from "../Grid/types";
import {
  defaultColumnProps,
  type ColumnPropsWithDefaults
} from "./defaultColumnProps";
import { defaultTableProps } from "./defaultTableProps";
import { SortDirection } from "./SortDirection";
import type {
  TableImperativeAPI,
  TableProps,
  TableRowsRenderedParams,
  TableScrollParams
} from "./types";

/**
 * Returns a child element's props with `defaultColumnProps` applied (to the props that are undefined).
 *
 * `Table` reads the props of its children without rendering them,
 * so the defaults are applied to any child element (not only `Column` elements);
 * this allows components that wrap `Column` to be used as columns as well.
 */
function getColumnProps(child: ReactNode): ColumnPropsWithDefaults {
  const props = (
    isValidElement(child) ? child.props : {}
  ) as ColumnPropsWithDefaults;

  const resolved: Record<string, unknown> = { ...props };
  for (const key in defaultColumnProps) {
    if (resolved[key] === undefined) {
      resolved[key] =
        defaultColumnProps[key as keyof typeof defaultColumnProps];
    }
  }

  return resolved as ColumnPropsWithDefaults;
}

/** Determines the flex-shrink, flex-grow, and width values for a cell (header or column). */
function getFlexStyleForColumn(
  column: ColumnPropsWithDefaults,
  customStyle: CSSProperties = {}
): CSSProperties {
  const flexValue = `${column.flexGrow} ${column.flexShrink} ${column.width}px`;

  const style: CSSProperties = {
    ...customStyle,
    flex: flexValue,
    msFlex: flexValue,
    WebkitFlex: flexValue
  };

  if (column.maxWidth) {
    style.maxWidth = column.maxWidth;
  }

  if (column.minWidth) {
    style.minWidth = column.minWidth;
  }

  return style;
}

// Callbacks read by the (stable) Grid event handlers.
// They are updated in an insertion effect, so they are current when the Grid calls them during its commit phase.
type LatestCallbacks = {
  onRowsRendered: (params: TableRowsRenderedParams) => void;
  onScroll: (params: TableScrollParams) => void;
};

// Mutable, per-instance values; only modified by effects, ref callbacks, and the Grid's cell renderer (see below).
type TableInternals = {
  // The inner Grid (keeps cell size invalidations requested by cells while the Table is mounting; see createInnerGridRef)
  innerGrid: InnerGridRef;

  // The inner Grid's scrolling container element
  gridElement: HTMLDivElement | null;

  latest: LatestCallbacks;
};

function createTableInstance(latest: LatestCallbacks) {
  const internals: TableInternals = {
    gridElement: null,
    innerGrid: createInnerGridRef(),
    latest
  };

  const { getGrid } = internals.innerGrid;

  const handle: TableImperativeAPI = {
    forceUpdateGrid() {
      getGrid()?.forceUpdate();
    },

    getOffsetForRow({ align, alignment, index } = {}) {
      const grid = getGrid();
      if (grid) {
        const { scrollTop } = grid.getOffsetForCell({
          alignment: align ?? alignment,
          rowIndex: index
        });

        return scrollTop;
      }
      return 0;
    },

    getScrollbarWidth() {
      const element = internals.gridElement;
      if (element) {
        const clientWidth = element.clientWidth || 0;
        const offsetWidth = element.offsetWidth || 0;
        return offsetWidth - clientWidth;
      }

      return 0;
    },

    invalidateCellSizeAfterRender({ columnIndex, rowIndex }) {
      internals.innerGrid.invalidateCellSizeAfterRender({
        columnIndex,
        rowIndex
      });
    },

    measureAllRows() {
      getGrid()?.measureAllCells();
    },

    recomputeGridSize({ columnIndex = 0, rowIndex = 0 } = {}) {
      internals.innerGrid.recomputeGridSize({ columnIndex, rowIndex });
    },

    recomputeRowHeights(index = 0) {
      internals.innerGrid.recomputeGridSize({
        columnIndex: 0,
        rowIndex: index
      });
    },

    scrollToCell({ align, columnIndex, rowIndex }) {
      getGrid()?.scrollToCell({ align, columnIndex, rowIndex });
    },

    scrollToPosition({ scrollTop }) {
      getGrid()?.scrollToPosition({ scrollTop });
    },

    scrollToRow({ align, index }) {
      getGrid()?.scrollToCell({ align, columnIndex: 0, rowIndex: index });
    }
  };

  const onScroll = ({ clientHeight, scrollHeight, scrollTop }: Scroll) => {
    internals.latest.onScroll({ clientHeight, scrollHeight, scrollTop });
  };

  const onSectionRendered = ({
    rowOverscanStartIndex,
    rowOverscanStopIndex,
    rowStartIndex,
    rowStopIndex
  }: RenderedSection) => {
    internals.latest.onRowsRendered({
      overscanStartIndex: rowOverscanStartIndex,
      overscanStopIndex: rowOverscanStopIndex,
      startIndex: rowStartIndex,
      stopIndex: rowStopIndex
    });
  };

  const setGridRef = internals.innerGrid.setGridRef;

  const setGridElementRef = (element: HTMLDivElement | null) => {
    internals.gridElement = element;
  };

  return {
    handle,
    internals,
    onScroll,
    onSectionRendered,
    setGridElementRef,
    setGridRef
  };
}

/**
 * Table component with fixed headers and virtualized rows for improved performance with large data sets.
 * This component expects explicit width, height, and padding parameters.
 *
 * Columns are described by `Column` children (or components that render a `Column`).
 * Scrolling is done through the imperative handle (`ref`): see `scrollToRow`, `scrollToCell`, and `scrollToPosition`.
 */
export const Table = /* @__PURE__ */ memo(
  /* @__PURE__ */ forwardRef<TableImperativeAPI, TableProps>(
    function Table(props, ref) {
      const {
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        children,
        className,
        disableHeader = defaultTableProps.disableHeader,
        estimatedRowSize = defaultTableProps.estimatedRowSize,
        gridClassName,
        gridStyle,
        headerClassName,
        headerHeight = defaultTableProps.headerHeight,
        headerRowRenderer = defaultTableProps.headerRowRenderer,
        headerStyle = defaultTableProps.headerStyle,
        height,
        id,
        noRowsRenderer = defaultTableProps.noRowsRenderer,
        onColumnClick,
        onHeaderClick,
        onRowClick,
        onRowDoubleClick,
        onRowMouseOut,
        onRowMouseOver,
        onRowRightClick,
        onRowsRendered = defaultTableProps.onRowsRendered,
        onScroll = defaultTableProps.onScroll,
        overscanIndicesGetter = defaultTableProps.overscanIndicesGetter,
        overscanRowCount = defaultTableProps.overscanRowCount,
        rowClassName,
        rowCount,
        rowGetter,
        rowHeight,
        rowRenderer = defaultTableProps.rowRenderer,
        rowStyle = defaultTableProps.rowStyle,
        scrollElement,
        sort,
        sortBy,
        sortDirection,
        style = defaultTableProps.style,
        width
      } = props;

      const [scrollbarWidth, setScrollbarWidth] = useState(0);

      // The instance (and its stable imperative handle) is created once
      const [
        {
          handle,
          internals,
          onScroll: onGridScroll,
          onSectionRendered,
          setGridElementRef,
          setGridRef
        }
      ] = useState(() => createTableInstance({ onRowsRendered, onScroll }));

      useImperativeHandle(ref, () => handle, [handle]);

      useMissingHeightWarning("Table", height, scrollElement);

      useInsertionEffect(() => {
        internals.latest = { onRowsRendered, onScroll };
      });

      // Equivalent of the 9.x componentDidMount/componentDidUpdate:
      // the header row is padded by the width of the inner Grid's vertical scrollbar (if any).
      // (Setting the same value again does not re-render.)
      useIsomorphicLayoutEffect(() => {
        setScrollbarWidth(handle.getScrollbarWidth());
      });

      // Column props (with defaults applied) and the cached column flex styles (shared by all rows);
      // these are recomputed only when the children change.
      // Header and row cells are keyed by their Column's key (Children.toArray provides a unique key for every child,
      // based on its own key if it has one), so that the cells of a column move with it when columns are reordered (#1725).
      const [columns, columnKeys] = useMemo(() => {
        const columnElements = Children.toArray(children);
        return [
          columnElements.map(getColumnProps),
          columnElements.map((child, index) =>
            isValidElement(child) && child.key !== null
              ? String(child.key)
              : String(index)
          )
        ];
      }, [children]);
      const cachedColumnStyles = useMemo(
        () =>
          columns.map(
            (column): CSSProperties => ({
              overflow: "hidden",
              ...getFlexStyleForColumn(
                column,
                column.style || defaultColumnProps.style
              )
            })
          ),
        [columns]
      );

      const createRow = useCallback(
        ({
          rowIndex: index,
          isScrolling,
          key,
          style: cellStyle
        }: CellRendererParams): ReturnType<CellRenderer> => {
          const rowClass =
            typeof rowClassName === "function"
              ? rowClassName({ index })
              : rowClassName;
          const rowStyleObject =
            typeof rowStyle === "function" ? rowStyle({ index }) : rowStyle;
          const rowData = rowGetter({ index });

          const renderedColumns = columns.map((column, columnIndex) => {
            const {
              cellDataGetter,
              cellRenderer,
              className: columnClassName,
              columnData,
              dataKey,
              id: columnId
            } = column;

            const cellData = cellDataGetter({ columnData, dataKey, rowData });
            const renderedCell = cellRenderer({
              cellData,
              columnData,
              columnIndex,
              dataKey,
              isScrolling,
              // CellMeasurer interop: the Table handle delegates to the inner Grid
              parent: handle,
              rowData,
              rowIndex: index
            });

            const onClick = (event: MouseEvent<HTMLDivElement>) => {
              if (onColumnClick) {
                onColumnClick({ columnData, dataKey, event });
              }
            };

            const title =
              typeof renderedCell === "string" ? renderedCell : null;

            return (
              <div
                aria-colindex={columnIndex + 1}
                aria-describedby={columnId}
                className={clsx(
                  "ReactVirtualized__Table__rowColumn",
                  columnClassName
                )}
                key={"Row" + index + "-Col" + columnKeys[columnIndex]}
                onClick={onClick}
                role="gridcell"
                style={cachedColumnStyles[columnIndex]}
                title={title as string | undefined}
              >
                {renderedCell}
              </div>
            );
          });

          const flattenedStyle = {
            ...cellStyle,
            height:
              typeof rowHeight === "function"
                ? rowHeight({ index })
                : rowHeight,
            overflow: "hidden",
            paddingRight: scrollbarWidth,
            ...rowStyleObject
          };

          return rowRenderer({
            className: clsx("ReactVirtualized__Table__row", rowClass),
            columns: renderedColumns,
            index,
            isScrolling,
            key,
            onRowClick,
            onRowDoubleClick,
            onRowRightClick,
            onRowMouseOver,
            onRowMouseOut,
            rowData,
            style: flattenedStyle
          }) as ReturnType<CellRenderer>;
        },
        [
          cachedColumnStyles,
          columnKeys,
          columns,
          handle,
          onColumnClick,
          onRowClick,
          onRowDoubleClick,
          onRowMouseOut,
          onRowMouseOver,
          onRowRightClick,
          rowClassName,
          rowGetter,
          rowHeight,
          rowRenderer,
          rowStyle,
          scrollbarWidth
        ]
      );

      const createHeader = (column: ColumnPropsWithDefaults, index: number) => {
        const {
          columnData,
          dataKey,
          defaultSortDirection,
          disableSort,
          headerRenderer,
          id: columnId,
          label
        } = column;
        const sortEnabled = !disableSort && sort;

        const classNames = clsx(
          "ReactVirtualized__Table__headerColumn",
          headerClassName,
          column.headerClassName,
          {
            ReactVirtualized__Table__sortableHeaderColumn: sortEnabled
          }
        );
        const headerColumnStyle = getFlexStyleForColumn(column, {
          ...headerStyle,
          ...column.headerStyle
        });

        const renderedHeader = headerRenderer({
          columnData,
          dataKey,
          disableSort,
          label,
          sortBy,
          sortDirection
        });

        let headerOnClick:
            | ((
                event:
                  | MouseEvent<HTMLDivElement>
                  | KeyboardEvent<HTMLDivElement>
              ) => void)
            | undefined,
          headerOnKeyDown:
            | ((event: KeyboardEvent<HTMLDivElement>) => void)
            | undefined,
          headerTabIndex: number | undefined,
          headerAriaSort: AriaAttributes["aria-sort"],
          headerAriaLabel: string | undefined;

        if (sortEnabled || onHeaderClick) {
          // If this is a sortable header, clicking it should update the table data's sorting.
          const isFirstTimeSort = sortBy !== dataKey;

          // If this is the firstTime sort of this column, use the column default sort order.
          // Otherwise, invert the direction of the sort.
          const newSortDirection = isFirstTimeSort
            ? defaultSortDirection
            : sortDirection === SortDirection.DESC
              ? SortDirection.ASC
              : SortDirection.DESC;

          const onClick = (
            event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>
          ) => {
            if (sortEnabled) {
              sort({
                defaultSortDirection,
                event,
                sortBy: dataKey,
                sortDirection: newSortDirection
              });
            }
            if (onHeaderClick) {
              onHeaderClick({ columnData, dataKey, event });
            }
          };

          const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
            if (event.key === "Enter" || event.key === " ") {
              onClick(event);
            }
          };

          // Label may be a non-string node; this matches the original implementation.
          headerAriaLabel = (column["aria-label"] || label || dataKey) as
            | string
            | undefined;
          // Only sortable columns are announced as sortable ("none" = sortable, but not sorted) (#1291)
          if (sortEnabled) {
            headerAriaSort = "none";
          }
          headerTabIndex = 0;
          headerOnClick = onClick;
          headerOnKeyDown = onKeyDown;
        }

        // (The data may be sorted by a column even if the user can't change the sort order)
        if (sortBy === dataKey) {
          headerAriaSort =
            sortDirection === SortDirection.ASC ? "ascending" : "descending";
        }

        return (
          <div
            aria-label={headerAriaLabel}
            aria-sort={headerAriaSort}
            className={classNames}
            id={columnId}
            key={"Header-Col" + columnKeys[index]}
            onClick={headerOnClick}
            onKeyDown={headerOnKeyDown}
            role="columnheader"
            style={headerColumnStyle}
            tabIndex={headerTabIndex}
          >
            {renderedHeader}
          </div>
        );
      };

      // A Table with a scrollElement is scrolled by the scroll element (e.g. the window), along with its header;
      // so the rows may fill the whole viewport (whose height is measured by the inner Grid, which receives the scrollElement).
      const availableRowsHeight =
        scrollElement !== undefined
          ? height
          : disableHeader
            ? (height ?? 0)
            : (height ?? 0) - headerHeight;

      const rowClass =
        typeof rowClassName === "function"
          ? rowClassName({ index: -1 })
          : rowClassName;
      const rowStyleObject =
        typeof rowStyle === "function" ? rowStyle({ index: -1 }) : rowStyle;

      // All Table props are passed through to the inner Grid (as in 9.x), including props that have nothing to do with Grid
      // (e.g. sortBy and sortDirection): Grid is memoized and won't re-render unless its props change,
      // so any prop that should trigger a re-render of the rows must be specified here to avoid a stale display.
      // The same goes for scrollbarWidth (which is not a Grid prop).
      // "aria-readonly" is null (not undefined) so that Grid's default value is not used.
      const gridProps = {
        ...props,
        "aria-readonly": null,
        estimatedRowSize,
        overscanIndicesGetter,
        overscanRowCount,
        scrollbarWidth
      } as unknown as GridProps;

      return (
        <div
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-colcount={columns.length}
          aria-rowcount={rowCount}
          className={clsx("ReactVirtualized__Table", className)}
          id={id}
          role="grid"
          style={style}
        >
          {!disableHeader &&
            headerRowRenderer({
              className: clsx("ReactVirtualized__Table__headerRow", rowClass),
              columns: columns.map(createHeader),
              style: {
                height: headerHeight,
                overflow: "hidden",
                paddingRight: scrollbarWidth,
                width: width,
                ...rowStyleObject
              }
            })}

          <Grid
            {...gridProps}
            elementRef={setGridElementRef}
            autoContainerWidth
            className={clsx("ReactVirtualized__Table__Grid", gridClassName)}
            cellRenderer={createRow}
            columnWidth={width}
            columnCount={1}
            height={availableRowsHeight}
            id={undefined}
            noContentRenderer={noRowsRenderer}
            onScroll={onGridScroll}
            onSectionRendered={onSectionRendered}
            ref={setGridRef}
            role="rowgroup"
            style={{
              ...gridStyle,
              overflowX: "hidden"
            }}
          />
        </div>
      );
    }
  )
);
