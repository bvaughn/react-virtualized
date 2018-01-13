By default, `Table` assumes that its data will be sorted by single attribute, in either ascending or descending order.
For advanced use cases, you may want to sort by multiple fields.
This can be accomplished using the `createMultiSort` utility.

```jsx
import {
  createTableMultiSort,
  Column,
  Table,
} from 'react-virtualized';

function sortCallback({
  sortBy,
  sortDirection,
}) {
  // Sort your collection however you'd like.
  // 'sortBy' is an ordered Array of fields.
  // 'sortDirection' is a map of field name to "ASC" or "DESC" directions.
}

const sortState = createMultiSort(sortCallback);

// When rendering your header columns,
// Use the sort state exposed by sortState:
const headerRenderer = ({ dataKey, label }) => {
  const showSortIndicator = sortState.sortBy.includes(dataKey);
  return (
    <>
      <span title={label}>{label}</span>
      {showSortIndicator && (
        <SortIndicator sortDirection={sortState.sortDirection[dataKey]} />
      )}
    </>
  );
};

// Connect sortState to Table by way of the 'sort' prop:
<Table {...tableProps} sort={sortState.sort}>
  <Column {...columnProps} headerRenderer={headerRenderer} />
</Table>
```

The `createMultiSort` utility also accepts default sort-by values:
```js
const sortState = createMultiSort(sortCallback, {
  defaultSortBy: ['firstName', 'lastName'],
  defaultSortDirection: {
    firstName: 'ASC',
    lastName: 'ASC',
  },
});
```