import type { ReactNode } from "react";
import { CONTAINER_HEIGHT, CONTAINER_OFFSET } from "../../../tests";

// A scrollable element (to be used as the scrollElement of the component it contains), offset from the top of the page
export function ScrollContainer({
  children,
  ref
}: {
  children: ReactNode;
  ref: (element: HTMLDivElement | null) => void;
}) {
  return (
    <div
      id="container"
      ref={ref}
      style={{
        height: CONTAINER_HEIGHT,
        margin: CONTAINER_OFFSET,
        overflow: "auto",
        width: 500
      }}
    >
      {children}
    </div>
  );
}
