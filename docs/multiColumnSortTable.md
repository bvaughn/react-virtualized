By default, `Table` assumes that its data will be sorted by single attribute, in either ascending or descending order.
For advanced use cases, you may want to sort by multiple fields.
This can be accomplished using the `createMultiSort` utility.

```jsx
import {
  createTableMultiSort,
  Column,
  Table,
} from 'react-virtualized';

const sortState = createMultiSort();

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

// Sort your collection however you'd like.
// sortState.sortBy is an ordered Array of fields.
// sortState.sortDirection is a map of field name to "ASC" or "DESC" directions.
```

The `createMultiSort` utility also accepts default sort-by values:
```js
const sortState = createMultiSort({
  defaultSortBy: ['firstName', 'lastName'],
  defaultSortDirection: {
    firstName: 'ASC',
    lastName: 'ASC',
  },
});
```