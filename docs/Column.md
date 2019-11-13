## Column

Describes the header and cell contents of a table column.

#### Prop Types

| Property             | Type                              | Required? | Description                                                                                                                                   |
| :------------------- | :-------------------------------- | :-------: | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| cellDataGetter       | Function                          |           | Callback responsible for returning a cell's data, given its `dataKey`. [Learn more](#celldatagetter)                                          |
| cellRenderer         | Function                          |           | Callback responsible for rendering a cell's contents. [Learn more](#cellrenderer)                                                             |
| className            | String                            |           | CSS class to apply to rendered cell container                                                                                                 |
| columnData           | Object                            |           | Additional data passed to this column's `cellDataGetter`. Use this object to relay action-creators or relational data.                        |
| dataKey              | any                               |     ✓     | Uniquely identifies the row-data attribute corresponding to this cell (eg this might be "name" in an array of user objects).                  |
| defaultSortDirection | [SortDirection](SortDirection.md) |           | Default sort order when clicked for the first time. Valid options include "ASC" and "DESC". Defaults to "ASC"                                 |
| disableSort          | Boolean                           |           | If sort is enabled for the table at large, disable it for this column                                                                         |
| flexGrow             | Number                            |           | Flex grow style; defaults to 0                                                                                                                |
| flexShrink           | Number                            |           | Flex shrink style; defaults to 1                                                                                                              |
| headerClassName      | String                            |           | CSS class to apply to this column's header                                                                                                    |
| headerRenderer       | Function                          |           | Optional callback responsible for rendering a column's header column. [Learn more](#headerrenderer)                                           |
| headerStyle          | Object                            |           | Optional inline style to apply to this column's header                                                                                        |
| id                   | String                            |           | Optional id to set on the column header; used for [`aria-describedby`](https://www.w3.org/TR/wai-aria/states_and_properties#aria-describedby) |
| label                | Node                              |           | Header label for this column                                                                                                                  |
| maxWidth             | Number                            |           | Maximum width of column; this property will only be used if :flexGrow is greater than 0                                                       |
| minWidth             | Number                            |           | Minimum width of column                                                                                                                       |
| style                | Object                            |           | Optional inline style to apply to rendered cell container                                                                                     |
| width                | Number                            |     ✓     | Flex basis (width) for this column; This value can grow or shrink based on `flexGrow` and `flexShrink` properties                             |

#### cellDataGetter

Callback responsible for returning a cell's data, given its `dataKey`.
It should implement the following signature:

```javascript
function ({
  columnData: any,
  dataKey: string,
  rowData: any
}): any
```

A [default `cellDataGetter`](https://github.com/bvaughn/react-virtualized/blob/master/source/Table/defaultCellDataGetter.js) is provided that simply returns the attribute as a String.
This function expects to operate on either a vanilla Object or a Map-like object with a get method.
You should override this default method if your data is calculated or requires any custom processing.

#### cellRenderer

Callback responsible for rendering a cell's contents.
It should implement the following signature:

```javascript
function ({
  cellData: any,
  columnData: any,
  columnIndex: number,
  dataKey: string,
  isScrolling: boolean,
  rowData: any,
  rowIndex: number
}): node
```

A [default `cellRenderer`](https://github.com/bvaughn/react-virtualized/blob/master/source/Table/defaultCellRenderer.js) is provided that displays an attribute as a simple string
You should override this default method if your data is some other type of object or requires custom formatting.

#### headerRenderer

Callback responsible for rendering a cell's header column.
It should implement the following signature:

```javascript
function ({
  columnData: any,
  dataKey: string,
  disableSort: boolean,
  label: any,
  sortBy: string,
  sortDirection: SortDirection
}): element
```

A [default `headerRenderer`](https://github.com/bvaughn/react-virtualized/blob/master/source/Table/defaultHeaderRenderer.js) is provided that displays the column `label` along with a sort indicator if the column is sort-enabled and active.
You should override this default method if you want to customize the appearance of table columns.
