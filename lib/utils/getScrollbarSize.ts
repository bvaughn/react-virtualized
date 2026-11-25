let cachedSize: number | undefined;

/**
 * Measures (and caches) the width of the browser's native scrollbar.
 * Returns 0 when there is no DOM (e.g. during server rendering).
 */
export function getScrollbarSize(): number {
  if (cachedSize === undefined) {
    if (typeof document === "undefined" || !document.body) {
      return 0;
    }

    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.top = "-9999px";
    div.style.width = "50px";
    div.style.height = "50px";
    div.style.overflow = "scroll";

    document.body.appendChild(div);
    cachedSize = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);
  }

  return cachedSize;
}
