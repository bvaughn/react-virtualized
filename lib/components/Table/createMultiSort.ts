import type {
  MultiSortCallback,
  MultiSortOptions,
  MultiSortParams,
  MultiSortReturn,
  SortDirectionMap
} from "./types";

/**
 * Creates sort state (and a `sort` function compatible with the `Table` `sort` prop)
 * for sorting a `Table` by multiple fields.
 *
 * - Click sorts by a single field (toggling its direction if it was already sorted).
 * - SHIFT + click appends a field to the existing sort criteria (or toggles its direction).
 * - CONTROL/META + click removes a field from the sort criteria.
 *
 * Whenever the sort criteria change, new `sortBy` and `sortDirection` values are created (previous values are never mutated),
 * so they can be stored in React state (e.g. with `useState`) as passed to `sortCallback`.
 *
 * @param sortCallback Notified (with the updated `sortBy` and `sortDirection` values) whenever the sort criteria change.
 * @param options Optional default sort-by values.
 */
export function createMultiSort(
  sortCallback: MultiSortCallback,
  { defaultSortBy, defaultSortDirection = {} }: MultiSortOptions = {}
): MultiSortReturn {
  if (!sortCallback) {
    throw Error(`Required parameter "sortCallback" not specified`);
  }

  // The sort criteria are replaced (never mutated) when they change,
  // so that they can be stored in React state (e.g. with useState) and compared by reference.
  // (This also leaves the caller's defaultSortBy array unchanged.)
  let sortBy: string[] = defaultSortBy ? [...defaultSortBy] : [];
  let sortDirection: SortDirectionMap = {};
  sortBy.forEach((dataKey) => {
    sortDirection[dataKey] =
      defaultSortDirection[dataKey] !== undefined
        ? defaultSortDirection[dataKey]
        : "ASC";
  });

  const toggle = (direction: SortDirectionMap[string]) =>
    direction === "ASC" ? "DESC" : "ASC";

  function sort({
    defaultSortDirection,
    event,
    sortBy: dataKey
  }: MultiSortParams): void {
    if (event.shiftKey) {
      // Shift + click appends a column to existing criteria (or toggles its direction)
      if (sortDirection[dataKey] !== undefined) {
        sortDirection = {
          ...sortDirection,
          [dataKey]: toggle(sortDirection[dataKey])
        };
      } else {
        sortBy = [...sortBy, dataKey];
        sortDirection = { ...sortDirection, [dataKey]: defaultSortDirection };
      }
    } else if (event.ctrlKey || event.metaKey) {
      // Control + click removes column from sort (if present)
      if (sortBy.includes(dataKey)) {
        sortBy = sortBy.filter((key) => key !== dataKey);
        sortDirection = { ...sortDirection };
        delete sortDirection[dataKey];
      }
    } else {
      // Sort by the selected key only.
      // If it is already selected, reverse its sort direction; else, use the default direction.
      sortDirection = {
        [dataKey]:
          sortDirection[dataKey] !== undefined
            ? toggle(sortDirection[dataKey])
            : defaultSortDirection
      };
      sortBy = [dataKey];
    }

    // Notify application code
    sortCallback({
      sortBy,
      sortDirection
    });
  }

  return {
    sort,
    // (Getters, since the sort criteria are replaced when they change)
    get sortBy() {
      return sortBy;
    },
    get sortDirection() {
      return sortDirection;
    }
  };
}
