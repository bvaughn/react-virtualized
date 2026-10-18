/**
 * Element that scrolls a virtualized component (instead of the component scrolling itself):
 * `"window"`, or a scrollable DOM element.
 */
export type ScrollElement = "window" | Element;

/** A scroll element resolved to the object that is listened to (and scrolled). */
export type ResolvedScrollElement = Window | Element;

/** The part of the scroll element (e.g. the window) visible to the component. */
export type ScrollElementViewport = {
  /** Height of the scroll element's viewport (e.g. the window's inner height). */
  height: number;

  /** The scroll element is being scrolled. */
  isScrolling: boolean;

  /**
   * Scroll offset of the scroll element, relative to the top of the component's element
   * (i.e. the vertical scroll offset the component should render).
   * This is negative while the top of the component is below the top of the viewport.
   */
  scrollTop: number;
};

/** Provided to a component that is scrolled by a scroll element. */
export type ScrollElementLinkSource = {
  /**
   * Scrolls the scroll element so that the component is scrolled to the specified offset
   * (relative to the top of its element, like `ScrollElementViewport.scrollTop`).
   * Returns false if the scroll element was already scrolled to that offset (no scroll event will follow).
   */
  scrollTo(scrollTop: number): boolean;
};

/** Implemented by the components that can be scrolled by a scroll element (Grid and Masonry). */
export type ScrollElementLinkTarget = {
  /** The element whose top is the origin of the component's (vertical) scroll offset. */
  getElement(): Element | null;

  /** Links the component to its scroll element (or unlinks it, if `source` is null). */
  link(
    source: ScrollElementLinkSource | null,
    viewport: ScrollElementViewport
  ): void;

  /** Updates the viewport of a linked component. */
  setViewport(viewport: ScrollElementViewport): void;
};
