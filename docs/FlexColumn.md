FlexColumn
---------------

Describes the header and cell contents of a table column

#### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| cellClassName | String |  | CSS class to apply to cell |
| cellDataGetter | Function |  | Callback responsible for returning a cell's data, given its `dataKey`. [Learn more](#cellDataGetter) |
| cellRenderer |  Function |  | Callback responsible for rendering a cell's contents. [Learn more](#cellRenderer) |
| columnData | Object |  | Additional data passed to this column's `cellDataGetter` |
| dataKey | any | ✓ | Uniquely identifies the row-data attribute correspnding to this cell |
| disableSort | Boolean |  | If sort is enabled for the table at large, disable it for this column |
| flexGrow | Number |  | Flex grow style; defaults to 0 |
| flexShrink | Number |  | Flex shrink style; defaults to 1 |
| headerClassName | String |  | CSS class to apply to this column's header |
| label | String |  | Header label for this column |
| width | Number |  | Fixed width for this column |

#### cellDataGetter

Callback responsible for returning a cell's data, given its `dataKey`.
It should implement the following signature:

```javascript
function (dataKey: string, rowData: any): any
```

A default `cellDataGetter` is provided that simply returns the attribute as a String.
This function expects to operate on either a vanilla Object or an Immutable Map.
You should override this default method if your data is calculated or requires any custom processing.

#### cellRenderer

Callback responsible for rendering a cell's contents.
It should implement the following signature:

```javascript
function (cellData: any, cellDataKey: string, rowData: any, rowIndex: number, columnData: any): element
```

A defdault `cellRenderer` is provided that displays an attribute as a simple string
You should override this default method if your data is some other type of object.
