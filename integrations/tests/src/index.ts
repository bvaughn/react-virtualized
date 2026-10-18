// Shared between the integration app(s), which expose values on the window,
// and the Playwright specs, which use them through page.evaluate()

import type {
  GridImperativeAPI,
  ListImperativeAPI,
  MasonryImperativeAPI,
  TableImperativeAPI
} from "react-virtualized";

/** Default height of the header rendered above the virtualized component (see the `headerHeight` search param). */
export const HEADER_HEIGHT = 200;

/** Height of the scrollable container (for `scrollElement=container`), unless it is resized by a test. */
export const CONTAINER_HEIGHT = 400;

/** Offset of the scrollable container from the top/left of the page. */
export const CONTAINER_OFFSET = 50;

export const COLUMN_COUNT = 50;
export const COLUMN_WIDTH = 100;
export const ROW_COUNT = 1000;
export const ROW_HEIGHT = 50;
export const WIDTH = 400;

/** Height of the header row of the Table. */
export const TABLE_HEADER_HEIGHT = 40;

export const MASONRY_CELL_COUNT = 1000;
export const MASONRY_COLUMN_COUNT = 3;
export const MASONRY_COLUMN_WIDTH = 120;
export const MASONRY_SPACER = 10;

/** Height of a Masonry cell (measured using CellMeasurer). */
export function getMasonryCellHeight(index: number) {
  return 100 + (index % 4) * 30;
}

declare global {
  interface Window {
    grid?: GridImperativeAPI | null;
    list?: ListImperativeAPI | null;
    masonry?: MasonryImperativeAPI | null;
    table?: TableImperativeAPI | null;

    // Changes the height of the header above the virtualized component (without re-rendering the component)
    setHeaderHeight?: ((height: number) => void) | null;

    // For scrollElement=deferred: sets the scrollElement prop (initially null) to "window"
    linkScrollElement?: (() => void) | null;
  }
}
