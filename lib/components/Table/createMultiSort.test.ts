import { describe, expect, it, vi } from "vitest";
import { createMultiSort } from "./createMultiSort";
import type { MultiSortReturn, SortDirectionType } from "./types";

describe("createMultiSort", () => {
  function simulate(
    sort: MultiSortReturn["sort"],
    dataKey: string,
    eventModifier = "",
    defaultSortDirection: SortDirectionType = "ASC"
  ) {
    sort({
      defaultSortDirection,
      event: {
        ctrlKey: eventModifier === "control",
        metaKey: eventModifier === "meta",
        shiftKey: eventModifier === "shift"
      },
      sortBy: dataKey
    });
  }

  it("errors if the user did not specify a sort callback", () => {
    expect(createMultiSort).toThrow();
  });

  it("sets the correct default values", () => {
    const multiSort = createMultiSort(vi.fn(), {
      defaultSortBy: ["a", "b"],
      defaultSortDirection: {
        a: "ASC",
        b: "DESC"
      }
    });
    expect(multiSort.sortBy).toEqual(["a", "b"]);
    expect(multiSort.sortDirection.a).toBe("ASC");
    expect(multiSort.sortDirection.b).toBe("DESC");
  });

  it("sets the correct default sparse values", () => {
    const multiSort = createMultiSort(vi.fn(), {
      defaultSortBy: ["a", "b"]
    });
    expect(multiSort.sortBy).toEqual(["a", "b"]);
    expect(multiSort.sortDirection.a).toBe("ASC");
    expect(multiSort.sortDirection.b).toBe("ASC");
  });

  it("does not mutate the defaultSortBy array", () => {
    const defaultSortBy = ["a"];
    const multiSortA = createMultiSort(vi.fn(), { defaultSortBy });
    const multiSortB = createMultiSort(vi.fn(), { defaultSortBy });

    simulate(multiSortA.sort, "b", "shift");
    expect(multiSortA.sortBy).toEqual(["a", "b"]);
    simulate(multiSortA.sort, "a", "control");
    expect(multiSortA.sortBy).toEqual(["b"]);
    simulate(multiSortA.sort, "c");
    expect(multiSortA.sortBy).toEqual(["c"]);

    expect(defaultSortBy).toEqual(["a"]);
    expect(multiSortB.sortBy).toEqual(["a"]);
  });

  describe("immutability (#1585)", () => {
    it("creates new sortBy and sortDirection values whenever the sort criteria change", () => {
      const sortCallback = vi.fn();
      const multiSort = createMultiSort(sortCallback, {
        defaultSortBy: ["a"]
      });
      const initial = {
        sortBy: multiSort.sortBy,
        sortDirection: multiSort.sortDirection
      };

      // Each kind of change (click, shift + click, control + click)
      const changes: [string, string][] = [
        ["b", "shift"],
        ["b", "shift"],
        ["a", "control"],
        ["c", ""],
        ["c", ""]
      ];
      const seen = [initial];
      changes.forEach(([dataKey, modifier]) => {
        simulate(multiSort.sort, dataKey, modifier);
        const { sortBy, sortDirection } = sortCallback.mock.lastCall![0];
        seen.forEach((previous) => {
          expect(sortDirection).not.toBe(previous.sortDirection);
        });
        // (The returned object reflects the latest values)
        expect(multiSort.sortBy).toBe(sortBy);
        expect(multiSort.sortDirection).toBe(sortDirection);
        seen.push({ sortBy, sortDirection });
      });

      // Previously passed values are never mutated
      expect(seen.map(({ sortBy }) => sortBy)).toEqual([
        ["a"],
        ["a", "b"],
        ["a", "b"],
        ["b"],
        ["c"],
        ["c"]
      ]);
      expect(seen.map(({ sortDirection }) => sortDirection)).toEqual([
        { a: "ASC" },
        { a: "ASC", b: "ASC" },
        { a: "ASC", b: "DESC" },
        { b: "DESC" },
        { c: "ASC" },
        { c: "DESC" }
      ]);
    });

    it("keeps the same values if a control + click doesn't change the sort criteria", () => {
      const sortCallback = vi.fn();
      const multiSort = createMultiSort(sortCallback, {
        defaultSortBy: ["a"]
      });
      const { sortBy, sortDirection } = multiSort;
      simulate(multiSort.sort, "b", "control");
      expect(sortCallback.mock.lastCall![0].sortBy).toBe(sortBy);
      expect(sortCallback.mock.lastCall![0].sortDirection).toBe(sortDirection);
    });
  });

  describe("on click", () => {
    it("sets the correct default value for a field", () => {
      const multiSort = createMultiSort(vi.fn());

      simulate(multiSort.sort, "a");
      expect(multiSort.sortBy).toEqual(["a"]);
      expect(multiSort.sortDirection.a).toBe("ASC");

      simulate(multiSort.sort, "b", "", "DESC");
      expect(multiSort.sortBy).toEqual(["b"]);
      expect(multiSort.sortDirection.b).toBe("DESC");
    });

    it("toggles a field value", () => {
      const multiSort = createMultiSort(vi.fn());

      simulate(multiSort.sort, "a");
      expect(multiSort.sortBy).toEqual(["a"]);
      expect(multiSort.sortDirection.a).toBe("ASC");

      simulate(multiSort.sort, "a");
      expect(multiSort.sortBy).toEqual(["a"]);
      expect(multiSort.sortDirection.a).toBe("DESC");

      simulate(multiSort.sort, "b", "", "DESC");
      expect(multiSort.sortBy).toEqual(["b"]);
      expect(multiSort.sortDirection.b).toBe("DESC");

      simulate(multiSort.sort, "b", "", "DESC");
      expect(multiSort.sortBy).toEqual(["b"]);
      expect(multiSort.sortDirection.b).toBe("ASC");
    });

    it("resets sort-by fields", () => {
      const multiSort = createMultiSort(vi.fn(), {
        defaultSortBy: ["a", "b"]
      });
      expect(multiSort.sortBy).toEqual(["a", "b"]);

      simulate(multiSort.sort, "a");
      expect(multiSort.sortBy).toEqual(["a"]);
    });

    it("resets sort-direction fields", () => {
      const multiSort = createMultiSort(vi.fn(), {
        defaultSortBy: ["a", "b"],
        defaultSortDirection: {
          a: "DESC",
          b: "ASC"
        }
      });
      expect(multiSort.sortBy).toEqual(["a", "b"]);
      expect(multiSort.sortDirection.a).toEqual("DESC");
      expect(multiSort.sortDirection.b).toEqual("ASC");

      simulate(multiSort.sort, "a");
      expect(multiSort.sortBy).toEqual(["a"]);
      expect(multiSort.sortDirection.a).toEqual("ASC");
      expect(multiSort.sortDirection.b).toEqual(undefined);

      simulate(multiSort.sort, "b");
      expect(multiSort.sortBy).toEqual(["b"]);
      expect(multiSort.sortDirection.a).toEqual(undefined);
      expect(multiSort.sortDirection.b).toEqual("ASC");
    });
  });

  describe("on shift click", () => {
    it("appends a field to the sort by list", () => {
      const multiSort = createMultiSort(vi.fn());

      simulate(multiSort.sort, "a");
      expect(multiSort.sortBy).toEqual(["a"]);
      expect(multiSort.sortDirection.a).toBe("ASC");

      simulate(multiSort.sort, "b", "shift");
      expect(multiSort.sortBy).toEqual(["a", "b"]);
      expect(multiSort.sortDirection.a).toBe("ASC");
      expect(multiSort.sortDirection.b).toBe("ASC");
    });

    it("toggles an appended field value", () => {
      const multiSort = createMultiSort(vi.fn());

      simulate(multiSort.sort, "a");
      expect(multiSort.sortBy).toEqual(["a"]);
      expect(multiSort.sortDirection.a).toBe("ASC");

      simulate(multiSort.sort, "b", "shift");
      expect(multiSort.sortBy).toEqual(["a", "b"]);
      expect(multiSort.sortDirection.a).toBe("ASC");
      expect(multiSort.sortDirection.b).toBe("ASC");

      simulate(multiSort.sort, "a", "shift");
      expect(multiSort.sortBy).toEqual(["a", "b"]);
      expect(multiSort.sortDirection.a).toBe("DESC");
      expect(multiSort.sortDirection.b).toBe("ASC");

      simulate(multiSort.sort, "a", "shift");
      expect(multiSort.sortBy).toEqual(["a", "b"]);
      expect(multiSort.sortDirection.a).toBe("ASC");
      expect(multiSort.sortDirection.b).toBe("ASC");
    });

    it("able to shift+click more than once", () => {
      const multiSort = createMultiSort(vi.fn());

      simulate(multiSort.sort, "a");
      expect(multiSort.sortBy).toEqual(["a"]);
      expect(multiSort.sortDirection.a).toBe("ASC");

      simulate(multiSort.sort, "b", "shift");
      expect(multiSort.sortBy).toEqual(["a", "b"]);
      expect(multiSort.sortDirection.a).toBe("ASC");
      expect(multiSort.sortDirection.b).toBe("ASC");

      simulate(multiSort.sort, "b");
      expect(multiSort.sortBy).toEqual(["b"]);
      expect(multiSort.sortDirection.b).toBe("DESC");

      simulate(multiSort.sort, "a", "shift");
      expect(multiSort.sortBy).toEqual(["b", "a"]);
      expect(multiSort.sortDirection.a).toBe("ASC");
      expect(multiSort.sortDirection.b).toBe("DESC");
    });
  });

  ["control", "meta"].forEach((modifier) => {
    describe(`${modifier} click`, () => {
      it("removes a field from the sort by list", () => {
        const multiSort = createMultiSort(vi.fn(), {
          defaultSortBy: ["a", "b"]
        });
        expect(multiSort.sortBy).toEqual(["a", "b"]);

        simulate(multiSort.sort, "a", modifier);
        expect(multiSort.sortBy).toEqual(["b"]);

        simulate(multiSort.sort, "b", modifier);
        expect(multiSort.sortBy).toEqual([]);
      });

      it("ignores fields not in the list on control click", () => {
        const multiSort = createMultiSort(vi.fn(), {
          defaultSortBy: ["a", "b"]
        });
        expect(multiSort.sortBy).toEqual(["a", "b"]);

        simulate(multiSort.sort, "c", modifier);
        expect(multiSort.sortBy).toEqual(["a", "b"]);
      });
    });
  });
});
