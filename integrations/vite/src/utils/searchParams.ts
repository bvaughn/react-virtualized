import { useSearchParams } from "react-router";
import { HEADER_HEIGHT } from "../../../tests";

export type ScrollElementType = "container" | "deferred" | "window";

// Search params shared by the routes:
// - scrollElement: "window" (default), "container" (a scrollable element, stored via a state ref callback),
//   or "deferred" (initially null, set to "window" by window.linkScrollElement())
// - headerHeight: initial height of the header above the component
// - overscan: overscanRowCount (the component's default if not specified)
export function useRouteParams() {
  const [searchParams] = useSearchParams();

  const scrollElement = searchParams.get("scrollElement");
  const headerHeight = searchParams.get("headerHeight");
  const overscan = searchParams.get("overscan");

  return {
    headerHeight: headerHeight !== null ? Number(headerHeight) : HEADER_HEIGHT,
    overscanRowCount: overscan !== null ? Number(overscan) : undefined,
    scrollElementType: (scrollElement === "container" ||
    scrollElement === "deferred"
      ? scrollElement
      : "window") as ScrollElementType
  };
}
