import {
  cloneElement,
  Fragment,
  isValidElement,
  memo,
  useCallback,
  useInsertionEffect,
  useRef,
  useState,
  version,
  type ReactElement,
  type ReactNode,
  type Ref
} from "react";
import { useIsomorphicLayoutEffect } from "../../utils/useIsomorphicLayoutEffect";
import type { CellMeasureCache, CellMeasurerProps } from "./types";

/**
 * Wraps a cell and measures its rendered content.
 * Measurements are stored in a per-cell cache.
 * Cached-content is not be re-measured.
 *
 * The child must be a DOM element (e.g. `<div>`) or a component that passes its `ref` along to one;
 * otherwise use a function child and pass `registerChild` as the `ref` of the element to be measured.
 */
export const CellMeasurer = /* @__PURE__ */ Object.assign(
  /* @__PURE__ */ memo(function CellMeasurer(props: CellMeasurerProps) {
    const { children } = props;

    // Mutable values shared by the stable callbacks below
    const [internals] = useState(createInternals);

    // Latest props, for the stable callbacks (updated before child refs and layout effects run)
    const latestPropsRef = useRef(props);
    useInsertionEffect(() => {
      latestPropsRef.current = props;
    });

    const maybeMeasureCell = useCallback(() => {
      const { cache, columnIndex = 0, index, parent } = latestPropsRef.current;
      const rowIndex = latestPropsRef.current.rowIndex ?? index ?? 0;

      if (!cache.has(rowIndex, columnIndex)) {
        const measurements = getCellMeasurements(
          cache,
          getMeasurableNode(internals)
        );
        if (measurements === null) {
          // Leave the cache alone (the cell keeps its default size) rather than storing 0x0
          if (process.env.NODE_ENV !== "production") {
            warnAboutMissingNode(cache, internals);
          }
          return;
        }

        cache.set(
          rowIndex,
          columnIndex,
          measurements.width,
          measurements.height
        );

        // If size has changed, let Grid know to re-render.
        if (
          parent &&
          typeof parent.invalidateCellSizeAfterRender === "function"
        ) {
          parent.invalidateCellSizeAfterRender({
            columnIndex,
            rowIndex
          });
        }
      }
    }, [internals]);

    const measure = useCallback(() => {
      const { cache, columnIndex = 0, index, parent } = latestPropsRef.current;
      const rowIndex = latestPropsRef.current.rowIndex ?? index ?? 0;

      if (!internals.isMounted) {
        // E.g. called from a timeout or a load event after the cell scrolled out of view;
        // there is nothing to measure (and storing 0x0 would collapse the cell once it's rendered again)
        return;
      }

      const measurements = getCellMeasurements(
        cache,
        getMeasurableNode(internals)
      );
      if (measurements === null) {
        if (process.env.NODE_ENV !== "production") {
          warnAboutMissingNode(cache, internals);
        }
        return;
      }

      const { height, width } = measurements;
      if (
        height !== cache.getHeight(rowIndex, columnIndex) ||
        width !== cache.getWidth(rowIndex, columnIndex)
      ) {
        cache.set(rowIndex, columnIndex, width, height);

        if (parent && typeof parent.recomputeGridSize === "function") {
          parent.recomputeGridSize({
            columnIndex,
            rowIndex
          });
        }
      }
    }, [internals]);

    const registerChild = useCallback(
      (element: Element | null | undefined) => {
        if (element && !(element instanceof Element)) {
          console.warn(
            "CellMeasurer registerChild expects to be passed Element or null"
          );
        }

        internals.registeredNode = element ?? null;
        if (element) {
          maybeMeasureCell();
        }
      },
      [internals, maybeMeasureCell]
    );

    useIsomorphicLayoutEffect(() => {
      internals.isMounted = true;
      return () => {
        internals.isMounted = false;
      };
    }, [internals]);

    // Equivalent of componentDidMount() + componentDidUpdate()
    useIsomorphicLayoutEffect(() => {
      maybeMeasureCell();
    });

    const resolvedChildren: ReactNode =
      typeof children === "function"
        ? children({ measure, registerChild })
        : children;

    const element = getMeasurableElement(resolvedChildren);
    const hasMeasurableElement = element !== null;
    useInsertionEffect(() => {
      internals.hasMeasurableElement = hasMeasurableElement;
    });

    // The child's own ref (if any) is composed with the ref CellMeasurer attaches to it
    const childRef = element !== null ? getElementRef(element) : null;
    const composedRef = useCallback(
      (node: unknown) => {
        if (node === null) {
          if (typeof internals.childRefCleanup === "function") {
            internals.childRefCleanup();
          } else {
            assignRef(childRef, null);
          }
          internals.childRefCleanup = undefined;
          internals.clonedNode = null;
        } else {
          internals.childRefCleanup = assignRef(childRef, node);
          internals.clonedNode = node;
        }
      },
      [childRef, internals]
    );

    if (element === null) {
      // Strings, arrays, fragments etc. can't be given a ref; render them as-is
      return resolvedChildren === undefined ? null : resolvedChildren;
    }

    return cloneElement(element, { ref: composedRef } as Partial<unknown>);
  }),
  {
    // Lets Grid's DEV warning about a missing "style" check the CellMeasurer's child instead (see issue #611)
    __internalCellMeasurerFlag: process.env.NODE_ENV !== "production"
  }
);

type Internals = {
  childRefCleanup: (() => void) | undefined | void;
  clonedNode: unknown;
  hasMeasurableElement: boolean;
  isMounted: boolean;
  registeredNode: unknown;
};

function createInternals(): Internals {
  return {
    childRefCleanup: undefined,
    clonedNode: null,
    hasMeasurableElement: false,
    isMounted: false,
    registeredNode: null
  };
}

function isHTMLElement(node: unknown): node is HTMLElement {
  if (node == null || typeof node !== "object") {
    return false;
  }

  // Supports nodes from other frames (which have their own HTMLElement class)
  const view = (node as Partial<Node>).ownerDocument?.defaultView;
  return view != null && node instanceof view.HTMLElement;
}

// An element registered with registerChild takes precedence over the element CellMeasurer attached its ref to
function getMeasurableNode(internals: Internals): HTMLElement | null {
  if (isHTMLElement(internals.registeredNode)) {
    return internals.registeredNode;
  } else if (isHTMLElement(internals.clonedNode)) {
    return internals.clonedNode;
  }
  return null;
}

function getCellMeasurements(
  cache: CellMeasureCache,
  node: HTMLElement | null
): { height: number; width: number } | null {
  // TODO Check for a bad combination of fixedWidth and missing numeric width or vice versa with height

  if (node === null) {
    return null;
  }

  const styleWidth = node.style.width;
  const styleHeight = node.style.height;

  // If we are re-measuring a cell that has already been measured,
  // It will have a hard-coded width/height from the previous measurement.
  // The fact that we are measuring indicates this measurement is probably stale,
  // So explicitly clear it out (eg set to "auto") so we can recalculate.
  // See issue #593 for more info.
  // Even if we are measuring initially- if we're inside of a MultiGrid component,
  // Explicitly clear width/height before measuring to avoid being tainted by another Grid.
  // eg top/left Grid renders before bottom/right Grid
  // Since the CellMeasurerCache is shared between them this taints derived cell size values.
  if (!cache.hasFixedWidth()) {
    node.style.width = "auto";
  }
  if (!cache.hasFixedHeight()) {
    node.style.height = "auto";
  }

  const height = Math.ceil(node.offsetHeight);
  const width = Math.ceil(node.offsetWidth);

  // Reset after measuring to avoid breaking styles; see #660
  if (styleWidth) {
    node.style.width = styleWidth;
  }
  if (styleHeight) {
    node.style.height = styleHeight;
  }

  return { height, width };
}

// Returns the child element CellMeasurer can attach a ref to (or null for strings, arrays, fragments, etc.)
function getMeasurableElement(children: ReactNode): ReactElement | null {
  if (!isValidElement(children) || children.type === Fragment) {
    return null;
  }

  // React 18 only passes refs to class components, host components and forwardRef() components;
  // attaching one to a plain function component logs an error (and the ref is never set).
  // React 19 passes the ref as a regular prop, so a function component can pass it along to a DOM element.
  if (!isReact19OrNewer() && isPlainFunctionComponent(children.type)) {
    return null;
  }

  return children;
}

const MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo");

function isPlainFunctionComponent(type: unknown): boolean {
  if (typeof type === "function") {
    return !(type.prototype && type.prototype.isReactComponent);
  } else if (
    type != null &&
    typeof type === "object" &&
    (type as { $$typeof?: symbol }).$$typeof === MEMO_TYPE
  ) {
    return isPlainFunctionComponent((type as { type: unknown }).type);
  }
  return false;
}

function isReact19OrNewer(): boolean {
  return parseInt(version, 10) >= 19;
}

// React 19 stores an element's ref in props.ref (reading element.ref logs a deprecation error);
// React 18 stores it in element.ref (and never in props).
// React 19 elements without a ref define element.ref as null (without logging an error).
function getElementRef(element: ReactElement): Ref<unknown> | null {
  const props = element.props as { ref?: Ref<unknown> } | null;
  if (props != null && "ref" in props) {
    return props.ref ?? null;
  }
  return (element as { ref?: Ref<unknown> | null }).ref ?? null;
}

function assignRef(
  ref: Ref<unknown> | null,
  value: unknown
): (() => void) | undefined | void {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref) {
    (ref as { current: unknown }).current = value;
  }
}

// Warn at most once per cache, to avoid flooding the console (one message per rendered cell)
const warnedCaches = /* @__PURE__ */ new WeakSet<object>();

function warnAboutMissingNode(cache: CellMeasureCache, internals: Internals) {
  if (warnedCaches.has(cache)) {
    return;
  }
  warnedCaches.add(cache);

  console.warn(
    internals.hasMeasurableElement
      ? "CellMeasurer could not find a DOM element to measure. " +
          "Its child should be a DOM element (e.g. <div>) or a component that passes its ref along to one " +
          "(in React 18, function components must use forwardRef). " +
          "Otherwise, use a function child and pass registerChild as the ref of the element to be measured."
      : "CellMeasurer could not find a DOM element to measure. " +
          "Its child should be a single DOM element (e.g. <div>), not text, an array or a fragment " +
          "(or, in React 18, a function component that doesn't use forwardRef). " +
          "Otherwise, use a function child and pass registerChild as the ref of the element to be measured."
  );
}
