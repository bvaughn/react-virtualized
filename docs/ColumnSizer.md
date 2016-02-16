ColumnSizer
---------------

High-order component that auto-calculates column-widths for `Grid` cells.

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| children | PropTypes.Element | ✓ | Function respondible for rendering a virtualized Grid. This function should implement the following signature: `({ adjustedWidth, getColumnWidth, registerChild }) => PropTypes.element` |
| columnMaxWidth | Number |  | Optional maximum allowed column width |
| columnMinWidth | Number |  | Optional minimum allowed column width |
| width | Number | ✓ | Width of Grid or `FlexTable` child |

### Children function

The child function is passed the following named parameters:

| Parameter | Type | Description |
|:---|:---|:---:|
| getColumnWidth | Function | This function should be passed to the `Grid`'s `columnWidth` property. |
| registerChild | Function | This function should be set as the child's `ref` property. It enables a set of rows to be refreshed once their data has finished loading. |
| adjustedWidth | Number | This number reflects the lesser of the overall `Grid` width or the width of all columns. Use this to make your `Grid` shrink to fit sparse content. |

### Examples

This example displays a `Grid` that shrinks to fit sparse content (using the `adjustedWidth` parameter).

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { ColumnSizer, Grid } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

// numColumns, numRows, someCalculatedHeight, and someCalculatedWidth determined here...

// Render your list
ReactDOM.render(
  <ColumnSizer
    columnMaxWidth={100}
    columnMinWidth={50}
    columnsCount={numColumns}
    width={someCalculatedWidth}
  >
    {({ adjustedWidth, getColumnWidth, registerChild }) => (
      <Grid
        ref={registerChild}
        columnWidth={getColumnWidth}
        columnsCount={numColumns}
        height={someCalculatedHeight}
        renderCell={someCellRenderer}
        rowHeight={50}
        rowsCount={numRows}
        width={adjustedWidth}
      />
    )}
  </ColumnSizer>,
  document.getElementById('example')
);
```
