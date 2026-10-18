/**
 * Binary Search Bounds
 * https://github.com/mikolalysenko/interval-tree-1d
 * Mikola Lysenko
 *
 * Inlined because of Content Security Policy issue caused by the use of `new Function(...)` syntax in an upstream dependency.
 * Issue reported here: https://github.com/mikolalysenko/binary-search-bounds/issues/5
 **/

import { binarySearchBounds as bounds } from "./binarySearchBounds";

/** An interval [low, high], optionally followed by additional data (e.g. an index). */
export type Interval = [number, number, ...number[]];

type ResultCode = 0 | 1 | 2;

const NOT_FOUND: ResultCode = 0;
const SUCCESS: ResultCode = 1;
const EMPTY: ResultCode = 2;

class IntervalTreeNode {
  mid: number;
  left: IntervalTreeNode | null;
  right: IntervalTreeNode | null;
  leftPoints: Interval[];
  rightPoints: Interval[];
  count: number;

  constructor(
    mid: number,
    left: IntervalTreeNode | null,
    right: IntervalTreeNode | null,
    leftPoints: Interval[],
    rightPoints: Interval[]
  ) {
    this.mid = mid;
    this.left = left;
    this.right = right;
    this.leftPoints = leftPoints;
    this.rightPoints = rightPoints;
    this.count =
      (left ? left.count : 0) + (right ? right.count : 0) + leftPoints.length;
  }

  intervals(result: Interval[]): Interval[] {
    // eslint-disable-next-line prefer-spread
    result.push.apply(result, this.leftPoints);
    if (this.left) {
      this.left.intervals(result);
    }
    if (this.right) {
      this.right.intervals(result);
    }
    return result;
  }

  insert(interval: Interval): void {
    const weight = this.count - this.leftPoints.length;
    this.count += 1;
    if (interval[1] < this.mid) {
      if (this.left) {
        if (4 * (this.left.count + 1) > 3 * (weight + 1)) {
          rebuildWithInterval(this, interval);
        } else {
          this.left.insert(interval);
        }
      } else {
        this.left = createIntervalTreeNode([interval]);
      }
    } else if (interval[0] > this.mid) {
      if (this.right) {
        if (4 * (this.right.count + 1) > 3 * (weight + 1)) {
          rebuildWithInterval(this, interval);
        } else {
          this.right.insert(interval);
        }
      } else {
        this.right = createIntervalTreeNode([interval]);
      }
    } else {
      const l = bounds.ge(this.leftPoints, interval, compareBegin);
      const r = bounds.ge(this.rightPoints, interval, compareEnd);
      this.leftPoints.splice(l, 0, interval);
      this.rightPoints.splice(r, 0, interval);
    }
  }

  remove(interval: Interval): ResultCode {
    // (Upstream subtracted the leftPoints array itself, which yields NaN and disabled rebalancing)
    const weight = this.count - this.leftPoints.length;
    if (interval[1] < this.mid) {
      if (!this.left) {
        return NOT_FOUND;
      }
      const rw = this.right ? this.right.count : 0;
      if (4 * rw > 3 * (weight - 1)) {
        return rebuildWithoutInterval(this, interval);
      }
      const r = this.left.remove(interval);
      if (r === EMPTY) {
        this.left = null;
        this.count -= 1;
        return SUCCESS;
      } else if (r === SUCCESS) {
        this.count -= 1;
      }
      return r;
    } else if (interval[0] > this.mid) {
      if (!this.right) {
        return NOT_FOUND;
      }
      const lw = this.left ? this.left.count : 0;
      if (4 * lw > 3 * (weight - 1)) {
        return rebuildWithoutInterval(this, interval);
      }
      const r = this.right.remove(interval);
      if (r === EMPTY) {
        this.right = null;
        this.count -= 1;
        return SUCCESS;
      } else if (r === SUCCESS) {
        this.count -= 1;
      }
      return r;
    } else {
      if (this.count === 1) {
        if (this.leftPoints[0] === interval) {
          return EMPTY;
        } else {
          return NOT_FOUND;
        }
      }
      if (this.leftPoints.length === 1 && this.leftPoints[0] === interval) {
        if (this.left && this.right) {
          // Upstream promoted the rightmost node of the left subtree into this node, which only adjusted the count
          // of that node's parent, and could leave intervals of the left subtree that span the promoted node's mid point
          // on the wrong side of it (where searches for them no longer reach); rebuild this subtree instead
          return rebuildWithoutInterval(this, interval);
        } else if (this.left) {
          copy(this, this.left);
        } else {
          copy(this, this.right!);
        }
        return SUCCESS;
      }
      for (
        let l = bounds.ge(this.leftPoints, interval, compareBegin);
        l < this.leftPoints.length;
        ++l
      ) {
        if (this.leftPoints[l][0] !== interval[0]) {
          break;
        }
        if (this.leftPoints[l] === interval) {
          this.count -= 1;
          this.leftPoints.splice(l, 1);
          for (
            let r = bounds.ge(this.rightPoints, interval, compareEnd);
            r < this.rightPoints.length;
            ++r
          ) {
            if (this.rightPoints[r][1] !== interval[1]) {
              break;
            } else if (this.rightPoints[r] === interval) {
              this.rightPoints.splice(r, 1);
              return SUCCESS;
            }
          }
        }
      }
      return NOT_FOUND;
    }
  }

  queryPoint<T>(x: number, cb: (interval: Interval) => T): T | undefined {
    if (x < this.mid) {
      if (this.left) {
        const r = this.left.queryPoint(x, cb);
        if (r) {
          return r;
        }
      }
      return reportLeftRange(this.leftPoints, x, cb);
    } else if (x > this.mid) {
      if (this.right) {
        const r = this.right.queryPoint(x, cb);
        if (r) {
          return r;
        }
      }
      return reportRightRange(this.rightPoints, x, cb);
    } else {
      return reportRange(this.leftPoints, cb);
    }
  }

  queryInterval<T>(
    lo: number,
    hi: number,
    cb: (interval: Interval) => T
  ): T | undefined {
    if (lo < this.mid && this.left) {
      const r = this.left.queryInterval(lo, hi, cb);
      if (r) {
        return r;
      }
    }
    if (hi > this.mid && this.right) {
      const r = this.right.queryInterval(lo, hi, cb);
      if (r) {
        return r;
      }
    }
    if (hi < this.mid) {
      return reportLeftRange(this.leftPoints, hi, cb);
    } else if (lo > this.mid) {
      return reportRightRange(this.rightPoints, lo, cb);
    } else {
      return reportRange(this.leftPoints, cb);
    }
  }
}

function copy(a: IntervalTreeNode, b: IntervalTreeNode) {
  a.mid = b.mid;
  a.left = b.left;
  a.right = b.right;
  a.leftPoints = b.leftPoints;
  a.rightPoints = b.rightPoints;
  a.count = b.count;
}

function rebuild(node: IntervalTreeNode, intervals: Interval[]) {
  // Note: an empty list of intervals results in a null tree (and a TypeError); preserved as-is.
  const ntree = createIntervalTreeNode(intervals)!;
  node.mid = ntree.mid;
  node.left = ntree.left;
  node.right = ntree.right;
  node.leftPoints = ntree.leftPoints;
  node.rightPoints = ntree.rightPoints;
  node.count = ntree.count;
}

function rebuildWithInterval(node: IntervalTreeNode, interval: Interval) {
  const intervals = node.intervals([]);
  intervals.push(interval);
  rebuild(node, intervals);
}

function rebuildWithoutInterval(
  node: IntervalTreeNode,
  interval: Interval
): ResultCode {
  const intervals = node.intervals([]);
  const idx = intervals.indexOf(interval);
  if (idx < 0) {
    return NOT_FOUND;
  }
  intervals.splice(idx, 1);
  if (intervals.length === 0) {
    return EMPTY;
  }
  rebuild(node, intervals);
  return SUCCESS;
}

function reportLeftRange<T>(
  arr: Interval[],
  hi: number,
  cb: (interval: Interval) => T
): T | undefined {
  for (let i = 0; i < arr.length && arr[i][0] <= hi; ++i) {
    const r = cb(arr[i]);
    if (r) {
      return r;
    }
  }
}

function reportRightRange<T>(
  arr: Interval[],
  lo: number,
  cb: (interval: Interval) => T
): T | undefined {
  for (let i = arr.length - 1; i >= 0 && arr[i][1] >= lo; --i) {
    const r = cb(arr[i]);
    if (r) {
      return r;
    }
  }
}

function reportRange<T>(
  arr: Interval[],
  cb: (interval: Interval) => T
): T | undefined {
  for (let i = 0; i < arr.length; ++i) {
    const r = cb(arr[i]);
    if (r) {
      return r;
    }
  }
}

function compareNumbers(a: number, b: number) {
  return a - b;
}

function compareBegin(a: Interval, b: Interval) {
  const d = a[0] - b[0];
  if (d) {
    return d;
  }
  return a[1] - b[1];
}

function compareEnd(a: Interval, b: Interval) {
  const d = a[1] - b[1];
  if (d) {
    return d;
  }
  return a[0] - b[0];
}

function createIntervalTreeNode(
  intervals: Interval[]
): IntervalTreeNode | null {
  if (intervals.length === 0) {
    return null;
  }
  const pts: number[] = [];
  for (let i = 0; i < intervals.length; ++i) {
    pts.push(intervals[i][0], intervals[i][1]);
  }
  pts.sort(compareNumbers);

  const mid = pts[pts.length >> 1];

  const leftIntervals: Interval[] = [];
  const rightIntervals: Interval[] = [];
  const centerIntervals: Interval[] = [];
  for (let i = 0; i < intervals.length; ++i) {
    const s = intervals[i];
    if (s[1] < mid) {
      leftIntervals.push(s);
    } else if (mid < s[0]) {
      rightIntervals.push(s);
    } else {
      centerIntervals.push(s);
    }
  }

  //Split center intervals
  const leftPoints = centerIntervals;
  const rightPoints = centerIntervals.slice();
  leftPoints.sort(compareBegin);
  rightPoints.sort(compareEnd);

  return new IntervalTreeNode(
    mid,
    createIntervalTreeNode(leftIntervals),
    createIntervalTreeNode(rightIntervals),
    leftPoints,
    rightPoints
  );
}

export type IntervalTree = {
  /** Inserts an interval into the tree. */
  insert(interval: Interval): void;

  /**
   * Removes an interval (by reference) from the tree.
   * Returns true if the interval was found and removed.
   */
  remove(interval: Interval): boolean;

  /**
   * Visits every interval containing the point; stops early (and returns the value)
   * if the callback returns a truthy value.
   */
  queryPoint<T>(p: number, cb: (interval: Interval) => T): T | undefined;

  /**
   * Visits every interval overlapping [lo, hi]; stops early (and returns the value)
   * if the callback returns a truthy value.
   */
  queryInterval<T>(
    lo: number,
    hi: number,
    cb: (interval: Interval) => T
  ): T | undefined;

  /** Number of intervals in the tree. */
  readonly count: number;

  /** A (new) list of every interval in the tree. */
  readonly intervals: Interval[];
};

//User friendly wrapper that makes it possible to support empty trees
class IntervalTreeWrapper implements IntervalTree {
  root: IntervalTreeNode | null;

  constructor(root: IntervalTreeNode | null) {
    this.root = root;
  }

  insert(interval: Interval): void {
    if (this.root) {
      this.root.insert(interval);
    } else {
      this.root = new IntervalTreeNode(
        interval[0],
        null,
        null,
        [interval],
        [interval]
      );
    }
  }

  remove(interval: Interval): boolean {
    if (this.root) {
      const r = this.root.remove(interval);
      if (r === EMPTY) {
        this.root = null;
      }
      return r !== NOT_FOUND;
    }
    return false;
  }

  queryPoint<T>(p: number, cb: (interval: Interval) => T): T | undefined {
    if (this.root) {
      return this.root.queryPoint(p, cb);
    }
  }

  queryInterval<T>(
    lo: number,
    hi: number,
    cb: (interval: Interval) => T
  ): T | undefined {
    if (lo <= hi && this.root) {
      return this.root.queryInterval(lo, hi, cb);
    }
  }

  get count(): number {
    if (this.root) {
      return this.root.count;
    }
    return 0;
  }

  get intervals(): Interval[] {
    if (this.root) {
      return this.root.intervals([]);
    }
    return [];
  }
}

export function createIntervalTree(intervals?: Interval[]): IntervalTree {
  if (!intervals || intervals.length === 0) {
    return new IntervalTreeWrapper(null);
  }
  return new IntervalTreeWrapper(createIntervalTreeNode(intervals));
}
