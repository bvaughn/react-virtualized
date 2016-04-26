FlexColumn
---------------

Describes the header and cell contents of a table column

#### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| cellClassName | String |  | CSS class to apply to cell |
| cellDataGetter | Function |  | Callback responsible for returning a cell's data, given its `dataKey`. [Learn more](#celldatagetter) |
| cellRenderer |  Function |  | Callback responsible for rendering a cell's contents. [Learn more](#cellrenderer) |
| columnData | Object |  | Additional data passed to this column's `cellDataGetter` |
| dataKey | any | ✓ | Uniquely identifies the row-data attribute correspnding to this cell |
| disableSort | Boolean |  | If sort is enabled for the table at large, disable it for this column |
| flexGrow | Number |  | Flex grow style; defaults to 0 |
| flexShrink | Number |  | Flex shrink style; defaults to 1 |
| headerClassName | String |  | CSS class to apply to this column's header |
| headerRenderer | Function |  | Optional callback responsible for rendering a column's header column. [Learn more](#headerrenderer) |
| label | String |  | Header label for this column |
| maxWidth | Number |  | Maximum width of column; this property will only be used if :flexGrow is greater than 0 |
| minWidth | Number |  | Minimum width of column |
| style | Object |  | Inline styles used for rendering the column cell.  Certain styles such as `maxWidth` and `minWidth` will be overridden if specified as other props.  `flex` will also be overridden by computed styling. |
| width | Number | ✓ | Flex basis (width) for this column; This value can grow or shrink based on `flexGrow` and `flexShrink` properties |

#### cellDataGetter

Callback responsible for returning a cell's data, given its `dataKey`.
It should implement the following signature:

```javascript
function (dataKey: string, rowData: any, columnData: any): any
```

A default `cellDataGetter` is provided that simply returns the attribute as a String.
This function expects to operate on either a vanilla Object or a Map-like object with a get method.
You should override this default method if your data is calculated or requires any custom processing.

#### cellRenderer

Callback responsible for rendering a cell's contents.
It should implement the following signature:

```javascript
function (cellData: any, cellDataKey: string, rowData: any, rowIndex: number, columnData: any): element
```

A default `cellRenderer` is provided that displays an attribute as a simple string
You should override this default method if your data is some other type of object or requires custom formatting.

#### headerRenderer

Callback responsible for rendering a cell's header column.
It should implement the following signature:

```javascript
function ({ columnData: any, dataKey: string, disableSort: boolean, label: string, sortBy: string, sortDirection: SortDirection }): element
```

A default `headerRenderer` is provided that displays the column `label` along with a sort indicator if the column is sort-enabled and active.
You should override this default method if you want to customize the appearance of table columns.
