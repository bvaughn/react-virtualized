import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  type KeyboardEvent
} from "react";
import { useIsomorphicLayoutEffect } from "../../utils/useIsomorphicLayoutEffect";
import { defaultArrowKeyStepperProps } from "./defaultArrowKeyStepperProps";
import type {
  ArrowKeyStepperChild,
  ArrowKeyStepperImperativeAPI,
  ArrowKeyStepperProps,
  ArrowKeyStepperRenderedSection,
  ScrollIndices
} from "./types";

type ArrowKeyStepperState = ScrollIndices & {
  prevScrollToColumn: number;
  prevScrollToRow: number;
};

const initialState: ArrowKeyStepperState = {
  scrollToColumn: 0,
  scrollToRow: 0,
  prevScrollToColumn: 0,
  prevScrollToRow: 0
};

// Equivalent of the 9.x getDerivedStateFromProps():
// an uncontrolled stepper resets its active cell whenever the scrollToColumn/scrollToRow props change.
function deriveState(
  isControlled: boolean,
  scrollToColumn: number,
  scrollToRow: number,
  prevState: ArrowKeyStepperState
): ArrowKeyStepperState {
  if (
    !isControlled &&
    (scrollToColumn !== prevState.prevScrollToColumn ||
      scrollToRow !== prevState.prevScrollToRow)
  ) {
    return {
      scrollToColumn,
      scrollToRow,
      prevScrollToColumn: scrollToColumn,
      prevScrollToRow: scrollToRow
    };
  }

  return prevState;
}

/**
 * This HOC decorates a virtualized component and responds to arrow-key events by scrolling one row or column at a time.
 * This provides a snap-to behavior rather than the default browser scrolling behavior.
 *
 * Note that unlike the other HOCs in react-virtualized, `ArrowKeyStepper` adds a `<div>` element around its children in order to attach a key-down event handler.
 * The appearance of this wrapper element can be customized using the `className` property.
 */
export const ArrowKeyStepper = /* @__PURE__ */ memo(
  /* @__PURE__ */ forwardRef<
    ArrowKeyStepperImperativeAPI,
    ArrowKeyStepperProps
  >(function ArrowKeyStepper(
    {
      children,
      className,
      columnCount,
      disabled = defaultArrowKeyStepperProps.disabled,
      isControlled = defaultArrowKeyStepperProps.isControlled,
      mode = defaultArrowKeyStepperProps.mode,
      onScrollToChange,
      rowCount,
      scrollToColumn:
        scrollToColumnProp = defaultArrowKeyStepperProps.scrollToColumn,
      scrollToRow: scrollToRowProp = defaultArrowKeyStepperProps.scrollToRow
    },
    ref
  ) {
    const [storedState, setState] = useState<ArrowKeyStepperState>(() =>
      deriveState(
        isControlled,
        scrollToColumnProp,
        scrollToRowProp,
        initialState
      )
    );

    // Apply prop changes during render (the documented replacement for getDerivedStateFromProps)
    const state = deriveState(
      isControlled,
      scrollToColumnProp,
      scrollToRowProp,
      storedState
    );
    if (state !== storedState) {
      setState(state);
    }

    const scrollToColumn = isControlled
      ? scrollToColumnProp
      : state.scrollToColumn;
    const scrollToRow = isControlled ? scrollToRowProp : state.scrollToRow;

    // Range of cells most recently rendered by the child (see onSectionRendered)
    const renderedSectionRef = useRef<ArrowKeyStepperRenderedSection>({
      columnStartIndex: 0,
      columnStopIndex: 0,
      rowStartIndex: 0,
      rowStopIndex: 0
    });

    const childRef = useRef<ArrowKeyStepperChild | null>(null);

    // Active cell as of the most recent commit; initialized for the first commit
    // (child refs are attached before this component's layout effects run)
    const activeCellRef = useRef<ScrollIndices>({
      scrollToColumn,
      scrollToRow
    });

    // The child and cell most recently scrolled into view; avoids redundant scrollToCell() calls
    // (e.g. when the same child is re-registered in StrictMode)
    const lastScrolledRef = useRef<{
      child: ArrowKeyStepperChild;
      scrollToColumn: number;
      scrollToRow: number;
    } | null>(null);

    const scrollChildToActiveCell = useCallback(() => {
      const child = childRef.current;
      const { scrollToColumn, scrollToRow } = activeCellRef.current;
      const lastScrolled = lastScrolledRef.current;

      if (
        child === null ||
        (lastScrolled !== null &&
          lastScrolled.child === child &&
          lastScrolled.scrollToColumn === scrollToColumn &&
          lastScrolled.scrollToRow === scrollToRow)
      ) {
        return;
      }

      lastScrolledRef.current = { child, scrollToColumn, scrollToRow };

      child.scrollToCell({
        columnIndex: scrollToColumn,
        rowIndex: scrollToRow
      });
    }, []);

    const registerChild = useCallback(
      (child: ArrowKeyStepperChild | null) => {
        childRef.current = child;
        if (child !== null) {
          scrollChildToActiveCell();
        }
      },
      [scrollChildToActiveCell]
    );

    useIsomorphicLayoutEffect(() => {
      activeCellRef.current = { scrollToColumn, scrollToRow };
      scrollChildToActiveCell();
    }, [scrollChildToActiveCell, scrollToColumn, scrollToRow]);

    const onSectionRendered = useCallback(
      ({
        columnStartIndex,
        columnStopIndex,
        rowStartIndex,
        rowStopIndex
      }: ArrowKeyStepperRenderedSection) => {
        renderedSectionRef.current = {
          columnStartIndex,
          columnStopIndex,
          rowStartIndex,
          rowStopIndex
        };
      },
      []
    );

    useImperativeHandle(
      ref,
      () => ({
        setScrollIndexes({ scrollToColumn, scrollToRow }: ScrollIndices) {
          setState((prevState) => ({
            ...prevState,
            scrollToColumn,
            scrollToRow
          }));
        }
      }),
      []
    );

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) {
        return;
      }

      const { columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex } =
        renderedSectionRef.current;

      let nextScrollToColumn = scrollToColumn;
      let nextScrollToRow = scrollToRow;

      // The above cases all prevent default event event behavior.
      // This is to keep the grid from scrolling after the snap-to update.
      switch (event.key) {
        case "ArrowDown":
          nextScrollToRow =
            mode === "cells"
              ? Math.min(scrollToRow + 1, rowCount - 1)
              : Math.min(rowStopIndex + 1, rowCount - 1);
          break;
        case "ArrowLeft":
          nextScrollToColumn =
            mode === "cells"
              ? Math.max(scrollToColumn - 1, 0)
              : Math.max(columnStartIndex - 1, 0);
          break;
        case "ArrowRight":
          nextScrollToColumn =
            mode === "cells"
              ? Math.min(scrollToColumn + 1, columnCount - 1)
              : Math.min(columnStopIndex + 1, columnCount - 1);
          break;
        case "ArrowUp":
          nextScrollToRow =
            mode === "cells"
              ? Math.max(scrollToRow - 1, 0)
              : Math.max(rowStartIndex - 1, 0);
          break;
      }

      if (
        nextScrollToColumn !== scrollToColumn ||
        nextScrollToRow !== scrollToRow
      ) {
        event.preventDefault();

        if (typeof onScrollToChange === "function") {
          onScrollToChange({
            scrollToColumn: nextScrollToColumn,
            scrollToRow: nextScrollToRow
          });
        }

        if (!isControlled) {
          setState((prevState) => ({
            ...prevState,
            scrollToColumn: nextScrollToColumn,
            scrollToRow: nextScrollToRow
          }));
        }
      }
    };

    return (
      <div className={className} onKeyDown={onKeyDown}>
        {children({
          onSectionRendered,
          registerChild,
          scrollToColumn,
          scrollToRow
        })}
      </div>
    );
  })
);
