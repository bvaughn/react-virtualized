// <begin>

import { createTableMultiSort } from "react-virtualized";

const sortState = createTableMultiSort(({ sortBy, sortDirection }) => {
  // "sortBy" is an ordered array of fields, e.g. ["lastName", "firstName"]
  // "sortDirection" maps each field to "ASC" or "DESC", e.g. { lastName: "ASC", firstName: "DESC" }
  // Sort your collection however you'd like,
  // then update your component state (or store) to re-render the Table.
  console.log(sortBy, sortDirection);
});

// sortState.sort: pass this to the Table "sort" prop
// sortState.sortBy and sortState.sortDirection: the current sort criteria

// <end>

export { sortState };
