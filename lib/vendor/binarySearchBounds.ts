/**
 * Binary Search Bounds
 * https://github.com/mikolalysenko/binary-search-bounds
 * Mikola Lysenko
 *
 * Inlined because of Content Security Policy issue caused by the use of `new Function(...)` syntax.
 * Issue reported here: https://github.com/mikolalysenko/binary-search-bounds/issues/5
 **/

type Compare<T, Y> = (a: T, b: Y) => number;

/**
 * Searches a sorted array, optionally within the inclusive [lo, hi] index range.
 * Either uses the natural ordering of the values, or the specified comparator.
 */
export type BoundsSearch = {
  <T>(array: ArrayLike<T>, value: T, lo?: number, hi?: number): number;
  <T, Y>(
    array: ArrayLike<T>,
    value: Y,
    compare: Compare<T, Y>,
    lo?: number,
    hi?: number
  ): number;
};

function _GEA<T>(a: ArrayLike<T>, l: number, h: number, y: T): number {
  let i = h + 1;
  while (l <= h) {
    const m = (l + h) >>> 1,
      x = a[m];
    if (x >= y) {
      i = m;
      h = m - 1;
    } else {
      l = m + 1;
    }
  }
  return i;
}
function _GEP<T, Y>(
  a: ArrayLike<T>,
  l: number,
  h: number,
  y: Y,
  c: Compare<T, Y>
): number {
  let i = h + 1;
  while (l <= h) {
    const m = (l + h) >>> 1,
      x = a[m];
    if (c(x, y) >= 0) {
      i = m;
      h = m - 1;
    } else {
      l = m + 1;
    }
  }
  return i;
}
function dispatchBsearchGE<T, Y>(
  a: ArrayLike<T>,
  y: T | Y,
  c?: Compare<T, Y> | number,
  l?: number,
  h?: number
): number {
  if (typeof c === "function") {
    return _GEP(
      a,
      l === void 0 ? 0 : l | 0,
      h === void 0 ? a.length - 1 : h | 0,
      y as Y,
      c
    );
  } else {
    return _GEA(
      a,
      c === void 0 ? 0 : c | 0,
      l === void 0 ? a.length - 1 : l | 0,
      y as T
    );
  }
}

function _GTA<T>(a: ArrayLike<T>, l: number, h: number, y: T): number {
  let i = h + 1;
  while (l <= h) {
    const m = (l + h) >>> 1,
      x = a[m];
    if (x > y) {
      i = m;
      h = m - 1;
    } else {
      l = m + 1;
    }
  }
  return i;
}
function _GTP<T, Y>(
  a: ArrayLike<T>,
  l: number,
  h: number,
  y: Y,
  c: Compare<T, Y>
): number {
  let i = h + 1;
  while (l <= h) {
    const m = (l + h) >>> 1,
      x = a[m];
    if (c(x, y) > 0) {
      i = m;
      h = m - 1;
    } else {
      l = m + 1;
    }
  }
  return i;
}
function dispatchBsearchGT<T, Y>(
  a: ArrayLike<T>,
  y: T | Y,
  c?: Compare<T, Y> | number,
  l?: number,
  h?: number
): number {
  if (typeof c === "function") {
    return _GTP(
      a,
      l === void 0 ? 0 : l | 0,
      h === void 0 ? a.length - 1 : h | 0,
      y as Y,
      c
    );
  } else {
    return _GTA(
      a,
      c === void 0 ? 0 : c | 0,
      l === void 0 ? a.length - 1 : l | 0,
      y as T
    );
  }
}

function _LTA<T>(a: ArrayLike<T>, l: number, h: number, y: T): number {
  let i = l - 1;
  while (l <= h) {
    const m = (l + h) >>> 1,
      x = a[m];
    if (x < y) {
      i = m;
      l = m + 1;
    } else {
      h = m - 1;
    }
  }
  return i;
}
function _LTP<T, Y>(
  a: ArrayLike<T>,
  l: number,
  h: number,
  y: Y,
  c: Compare<T, Y>
): number {
  let i = l - 1;
  while (l <= h) {
    const m = (l + h) >>> 1,
      x = a[m];
    if (c(x, y) < 0) {
      i = m;
      l = m + 1;
    } else {
      h = m - 1;
    }
  }
  return i;
}
function dispatchBsearchLT<T, Y>(
  a: ArrayLike<T>,
  y: T | Y,
  c?: Compare<T, Y> | number,
  l?: number,
  h?: number
): number {
  if (typeof c === "function") {
    return _LTP(
      a,
      l === void 0 ? 0 : l | 0,
      h === void 0 ? a.length - 1 : h | 0,
      y as Y,
      c
    );
  } else {
    return _LTA(
      a,
      c === void 0 ? 0 : c | 0,
      l === void 0 ? a.length - 1 : l | 0,
      y as T
    );
  }
}

function _LEA<T>(a: ArrayLike<T>, l: number, h: number, y: T): number {
  let i = l - 1;
  while (l <= h) {
    const m = (l + h) >>> 1,
      x = a[m];
    if (x <= y) {
      i = m;
      l = m + 1;
    } else {
      h = m - 1;
    }
  }
  return i;
}
function _LEP<T, Y>(
  a: ArrayLike<T>,
  l: number,
  h: number,
  y: Y,
  c: Compare<T, Y>
): number {
  let i = l - 1;
  while (l <= h) {
    const m = (l + h) >>> 1,
      x = a[m];
    if (c(x, y) <= 0) {
      i = m;
      l = m + 1;
    } else {
      h = m - 1;
    }
  }
  return i;
}
function dispatchBsearchLE<T, Y>(
  a: ArrayLike<T>,
  y: T | Y,
  c?: Compare<T, Y> | number,
  l?: number,
  h?: number
): number {
  if (typeof c === "function") {
    return _LEP(
      a,
      l === void 0 ? 0 : l | 0,
      h === void 0 ? a.length - 1 : h | 0,
      y as Y,
      c
    );
  } else {
    return _LEA(
      a,
      c === void 0 ? 0 : c | 0,
      l === void 0 ? a.length - 1 : l | 0,
      y as T
    );
  }
}

function _EQA<T>(a: ArrayLike<T>, l: number, h: number, y: T): number {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  l - 1;
  while (l <= h) {
    const m = (l + h) >>> 1,
      x = a[m];
    if (x === y) {
      return m;
    } else if (x <= y) {
      l = m + 1;
    } else {
      h = m - 1;
    }
  }
  return -1;
}
function _EQP<T, Y>(
  a: ArrayLike<T>,
  l: number,
  h: number,
  y: Y,
  c: Compare<T, Y>
): number {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  l - 1;
  while (l <= h) {
    const m = (l + h) >>> 1,
      x = a[m];
    const p = c(x, y);
    if (p === 0) {
      return m;
    } else if (p <= 0) {
      l = m + 1;
    } else {
      h = m - 1;
    }
  }
  return -1;
}
function dispatchBsearchEQ<T, Y>(
  a: ArrayLike<T>,
  y: T | Y,
  c?: Compare<T, Y> | number,
  l?: number,
  h?: number
): number {
  if (typeof c === "function") {
    return _EQP(
      a,
      l === void 0 ? 0 : l | 0,
      h === void 0 ? a.length - 1 : h | 0,
      y as Y,
      c
    );
  } else {
    return _EQA(
      a,
      c === void 0 ? 0 : c | 0,
      l === void 0 ? a.length - 1 : l | 0,
      y as T
    );
  }
}

export const binarySearchBounds: {
  ge: BoundsSearch;
  gt: BoundsSearch;
  lt: BoundsSearch;
  le: BoundsSearch;
  eq: BoundsSearch;
} = {
  ge: dispatchBsearchGE,
  gt: dispatchBsearchGT,
  lt: dispatchBsearchLT,
  le: dispatchBsearchLE,
  eq: dispatchBsearchEQ
};
