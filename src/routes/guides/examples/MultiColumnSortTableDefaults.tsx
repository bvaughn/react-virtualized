declare const sortCallback: Parameters<typeof createTableMultiSort>[0];

// <begin>

import { createTableMultiSort } from "react-virtualized";

const sortState = createTableMultiSort(sortCallback, {
  defaultSortBy: ["firstName", "lastName"],
  defaultSortDirection: {
    firstName: "ASC",
    lastName: "ASC"
  }
});

// <end>

export { sortState };
