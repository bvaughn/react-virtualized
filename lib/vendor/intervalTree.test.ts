import { describe, expect, it } from "vitest";
import { createIntervalTree, type Interval } from "./intervalTree";

// Seeded so that failures are reproducible
function createRandom(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

function sortIntervals(intervals: Interval[]): Interval[] {
  return [...intervals].sort((a, b) => a[2] - b[2]);
}

function queryPoint(tree: ReturnType<typeof createIntervalTree>, x: number) {
  const result: Interval[] = [];
  tree.queryPoint(x, (interval) => {
    result.push(interval);
  });
  return sortIntervals(result);
}

function queryInterval(
  tree: ReturnType<typeof createIntervalTree>,
  lo: number,
  hi: number
) {
  const result: Interval[] = [];
  tree.queryInterval(lo, hi, (interval) => {
    result.push(interval);
  });
  return sortIntervals(result);
}

describe("intervalTree", () => {
  it("should remove an interval and return whether it was found", () => {
    const a: Interval = [0, 10, 0];
    const b: Interval = [20, 30, 1];
    const tree = createIntervalTree([a, b]);

    expect(tree.remove(a)).toBe(true);
    expect(tree.count).toBe(1);
    expect(tree.intervals).toEqual([b]);

    // Intervals are removed by reference
    expect(tree.remove([20, 30, 1])).toBe(false);
    expect(tree.remove(a)).toBe(false);
    expect(tree.count).toBe(1);

    expect(tree.remove(b)).toBe(true);
    expect(tree.count).toBe(0);
    expect(tree.intervals).toEqual([]);
    expect(tree.remove(b)).toBe(false);
  });

  it.each([1, 2, 3, 4, 5])(
    "should match a list of intervals when inserting and removing (seed %i)",
    (seed) => {
      const random = createRandom(seed * 7919);
      const size = (max: number) => Math.floor(random() * max);

      const tree = createIntervalTree();
      const expected: Interval[] = [];
      let nextId = 0;

      for (let step = 0; step < 2000; step++) {
        if (expected.length === 0 || random() < 0.55) {
          const lo = size(1000);
          const interval: Interval = [lo, lo + size(100), nextId++];
          tree.insert(interval);
          expected.push(interval);
        } else {
          const [interval] = expected.splice(size(expected.length), 1);
          expect(tree.remove(interval)).toBe(true);
          expect(tree.remove(interval)).toBe(false);
        }

        expect(tree.count).toBe(expected.length);

        if (step % 10 === 0) {
          expect(sortIntervals(tree.intervals)).toEqual(
            sortIntervals(expected)
          );

          const x = size(1100);
          expect(queryPoint(tree, x)).toEqual(
            sortIntervals(expected.filter(([lo, hi]) => lo <= x && x <= hi))
          );

          const lo = size(1100);
          const hi = lo + size(200);
          expect(queryInterval(tree, lo, hi)).toEqual(
            sortIntervals(
              expected.filter(([start, end]) => start <= hi && end >= lo)
            )
          );
        }
      }
    }
  );
});
