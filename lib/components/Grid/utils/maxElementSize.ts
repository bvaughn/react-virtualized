// The largest size (in pixels) of the scrollable content; beyond it, scroll offsets are scaled (see ScalingCellSizeAndPositionManager).
// Modern browsers support at least this size: Chromium and WebKit support taller elements, and Firefox about 17.9M px.
// (Version 9 used a much smaller 1.5M px limit, required by Internet Explorer, in every browser other than Chrome;
// React 18+ doesn't support Internet Explorer.)
const MAX_ELEMENT_SIZE = 1.67771e7;

export const getMaxElementSize = (): number => MAX_ELEMENT_SIZE;
