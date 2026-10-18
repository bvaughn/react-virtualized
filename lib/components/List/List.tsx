import clsx from "clsx";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  memo,
  useCallback,
  useImperativeHandle,
  useState,
  type ReactElement
} from "react";
import { createInnerGridRef } from "../../utils/createInnerGridRef";
import { useMissingHeightWarning } from "../../utils/scrollElement/useMissingHeightWarning";
import { Grid } from "../Grid/Grid";
import type {
  CellRendererParams,
  GridImperativeAPI,
  Scroll as GridScroll,
  RenderedSection
} from "../Grid/types";
import { defaultListProps } from "./defaultListProps";
import type { ListImperativeAPI, ListProps } from "./types";

/**
 * It is inefficient to create and manage a large list of DOM elements within a scrolling container
 * if only a few of those elements are visible. The primary purpose of this component is to improve
 * performance by only rendering the DOM nodes that a user is able to see based on their current
 * scroll position.
 *
 * This component renders a virtualized list of elements with either fixed or dynamic heights.
 */
export const List = /* @__PURE__ */ memo(
  /* @__PURE__ */ forwardRef<ListImperativeAPI, ListProps>(
    function List(props, ref) {
      const {
        "aria-label": ariaLabel,
        "aria-readonly": ariaReadonly,
        className,
        containerRole,
        estimatedRowSize = defaultListProps.estimatedRowSize,
        noRowsRenderer = defaultListProps.noRowsRenderer,
        onRowsRendered = defaultListProps.onRowsRendered,
        onScroll = defaultListProps.onScroll,
        overscanIndicesGetter = defaultListProps.overscanIndicesGetter,
        overscanRowCount = defaultListProps.overscanRowCount,
        role = defaultListProps.role,
        rowRenderer,
        style = defaultListProps.style,
        tabIndex = defaultListProps.tabIndex,
        height,
        scrollElement,
        width,
        ...rest
      } = props;

      // The imperative handle is created once (it reads the inner Grid through a ref)
      const [{ handle, setGridRef }] = useState(createListInstance);

      useImperativeHandle(ref, () => handle, [handle]);

      useMissingHeightWarning("List", height, scrollElement);

      // With role="list" (the default), the rows are list items within the list (#1657);
      // otherwise (e.g. role="grid"), the Grid's roles and ARIA defaults apply.
      const isList = role === "list";

      const cellRenderer = useCallback(
        ({
          isScrolling,
          isVisible,
          key,
          rowIndex,
          style: cellStyle
        }: CellRendererParams) => {
          // TRICKY The style object is sometimes cached by Grid.
          // This prevents new style objects from bypassing shallowCompare().
          // However as of React 16, style props are auto-frozen (at least in dev mode)
          // Check to make sure we can still modify the style before proceeding.
          // https://github.com/facebook/react/commit/977357765b44af8ff0cfea327866861073095c12#commitcomment-20648713
          const widthDescriptor = Object.getOwnPropertyDescriptor(
            cellStyle,
            "width"
          );
          if (widthDescriptor && widthDescriptor.writable) {
            // By default, List cells should be 100% width.
            // This prevents them from flowing under a scrollbar (if present).
            cellStyle.width = "100%";
          }

          const row = rowRenderer({
            index: rowIndex,
            isScrolling,
            isVisible,
            key,
            parent: handle,
            style: cellStyle
          });

          // (Grid gives a row without a role the "gridcell" role)
          if (
            isList &&
            isValidElement<{ role?: string }>(row) &&
            !row.props.role
          ) {
            return cloneElement(row as ReactElement<{ role?: string }>, {
              role: "listitem"
            });
          }
          return row;
        },
        [handle, isList, rowRenderer]
      );

      const onGridScroll = useCallback(
        ({ clientHeight, scrollHeight, scrollTop }: GridScroll) => {
          onScroll({ clientHeight, scrollHeight, scrollTop });
        },
        [onScroll]
      );

      const onSectionRendered = useCallback(
        ({
          rowOverscanStartIndex,
          rowOverscanStopIndex,
          rowStartIndex,
          rowStopIndex
        }: RenderedSection) => {
          onRowsRendered({
            overscanStartIndex: rowOverscanStartIndex,
            overscanStopIndex: rowOverscanStopIndex,
            startIndex: rowStartIndex,
            stopIndex: rowStopIndex
          });
        },
        [onRowsRendered]
      );

      return (
        <Grid
          {...rest}
          // null (rather than undefined) so that the Grid's defaults for a grid are not used
          aria-label={
            ariaLabel ?? (isList ? (null as unknown as string) : undefined)
          }
          aria-readonly={
            ariaReadonly ?? (isList ? (null as unknown as boolean) : undefined)
          }
          autoContainerWidth
          cellRenderer={cellRenderer}
          className={clsx("ReactVirtualized__List", className)}
          columnCount={1}
          columnWidth={width}
          containerRole={containerRole ?? (isList ? "presentation" : undefined)}
          estimatedRowSize={estimatedRowSize}
          // (A missing height is reported by the List itself; see above)
          height={height ?? (scrollElement === undefined ? 0 : undefined)}
          noContentRenderer={noRowsRenderer}
          onScroll={onGridScroll}
          onSectionRendered={onSectionRendered}
          overscanIndicesGetter={overscanIndicesGetter}
          overscanRowCount={overscanRowCount}
          ref={setGridRef}
          role={role}
          scrollElement={scrollElement}
          style={style}
          tabIndex={tabIndex}
          width={width}
        />
      );
    }
  )
);

type ListInstance = {
  handle: ListImperativeAPI;
  setGridRef: (grid: GridImperativeAPI | null) => void;
};

// Creates the (stable) imperative handle of a List (every method delegates to the inner Grid)
// and the ref callback for the inner Grid.
function createListInstance(): ListInstance {
  // (Keeps cell size invalidations requested by rows while the List is mounting; see createInnerGridRef)
  const innerGrid = createInnerGridRef();
  const { getGrid } = innerGrid;

  const handle: ListImperativeAPI = {
    forceUpdateGrid() {
      getGrid()?.forceUpdate();
    },

    getOffsetForRow({ align, alignment, index } = {}) {
      const grid = getGrid();
      if (grid) {
        const { scrollTop } = grid.getOffsetForCell({
          alignment: align ?? alignment,
          columnIndex: 0,
          rowIndex: index
        });

        return scrollTop;
      }
      return 0;
    },

    invalidateCellSizeAfterRender({ columnIndex, rowIndex }) {
      innerGrid.invalidateCellSizeAfterRender({ columnIndex, rowIndex });
    },

    measureAllRows() {
      getGrid()?.measureAllCells();
    },

    recomputeGridSize({ columnIndex = 0, rowIndex = 0 } = {}) {
      innerGrid.recomputeGridSize({ columnIndex, rowIndex });
    },

    recomputeRowHeights(index = 0) {
      innerGrid.recomputeGridSize({ columnIndex: 0, rowIndex: index });
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

  return { handle, setGridRef: innerGrid.setGridRef };
}
