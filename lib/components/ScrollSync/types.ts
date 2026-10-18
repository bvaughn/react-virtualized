import type { ReactNode } from "react";

/**
 * Scroll and size values tracked by `ScrollSync`.
 * This is also the shape of the object accepted by the `onScroll` callback.
 */
export type ScrollSyncScrollParams = {
  /** Height of the visible portion of the `Grid` (or other scroll-synced component). */
  clientHeight: number;

  /** Width of the visible portion of the `Grid` (or other scroll-synced component). */
  clientWidth: number;

  /** Total height of all rows in the `Grid` (or other scroll-synced component). */
  scrollHeight: number;

  /** The current scroll-left offset. */
  scrollLeft: number;

  /** The current scroll-top offset. */
  scrollTop: number;

  /** Total width of all columns in the `Grid` (or other scroll-synced component). */
  scrollWidth: number;
};

/**
 * A component that can be registered with `ScrollSync` (via `registerChild`), e.g. a `Grid`.
 * `ScrollSync` scrolls it by calling its `scrollToPosition` method.
 */
export type ScrollSyncChild = {
  scrollToPosition(params: { scrollLeft?: number; scrollTop?: number }): void;
};

/**
 * Parameters passed to the `ScrollSync` children render function.
 */
export type ScrollSyncChildProps = {
  /** Height of the visible portion of the `Grid` (or other scroll-synced component). */
  clientHeight: number;

  /** Width of the visible portion of the `Grid` (or other scroll-synced component). */
  clientWidth: number;

  /**
   * This function should be passed through (as the `onScroll` prop) to every registered child that the user can scroll.
   * Whenever it reports a new scroll offset, the other registered children are scrolled to match it
   * and the render function is called again with the updated scroll and size values.
   */
  onScroll: (params: ScrollSyncScrollParams) => void;

  /**
   * Returns a ref callback that registers a virtualized child (e.g. a `Grid`) under the specified key:
   * `<Grid ref={registerChild("header")} onScroll={onScroll} />`.
   *
   * When a scroll offset is reported through `onScroll`, `ScrollSync` scrolls all registered children to it
   * (only the axes that changed are synced).
   * A child registered after scrolling has happened is scrolled to the current offset.
   *
   * The returned callback is stable for a given key, so it can be passed inline during render.
   * Registering a different component under the same key replaces the previous one.
   */
  registerChild: (
    key: string
  ) => (child: ScrollSyncChild | null) => void | (() => void);

  /** Total height of all rows in the `Grid` (or other scroll-synced component). */
  scrollHeight: number;

  /** The current scroll-left offset. */
  scrollLeft: number;

  /** The current scroll-top offset. */
  scrollTop: number;

  /** Total width of all columns in the `Grid` (or other scroll-synced component). */
  scrollWidth: number;
};

export type ScrollSyncProps = {
  /**
   * Function responsible for rendering 2 or more virtualized components.
   * It is passed the current scroll and size values (`clientHeight`, `clientWidth`, `scrollHeight`, `scrollLeft`, `scrollTop`, `scrollWidth`),
   * an `onScroll` callback that should be passed through to the virtualized children that the user can scroll,
   * and a `registerChild` function that returns a ref callback for each virtualized child that should be kept in sync
   * (e.g. `<Grid ref={registerChild("body")} onScroll={onScroll} />`).
   * The scroll and size values can also be used for custom rendering (e.g. shading based on the scroll offset).
   */
  children: (params: ScrollSyncChildProps) => ReactNode;
};
