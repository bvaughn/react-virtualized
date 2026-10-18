import { createRef } from "react";
import type { MasonryImperativeAPI } from "react-virtualized";
import { cellPositioner } from "./MasonryCellPositioner";

const masonryRef = createRef<MasonryImperativeAPI>();

// <begin>

// eg in response to a window resize
function onResize({ width }: { width: number }) {
  const columnWidth = 250;
  const spacer = 15;

  cellPositioner.reset({
    columnCount: Math.floor((width + spacer) / (columnWidth + spacer)),
    columnWidth,
    spacer
  });

  // Discard cached positions and re-position cells using their cached sizes
  masonryRef.current?.recomputeCellPositions();
}

// <end>

export { onResize };
