CellMeasurer
---------------

High-order component that automatically measures a cell's contents by temporarily rendering it in a way that is not visible to the user.
Specify a fixed width to measure dynamic height (or vice versa).
This is an advanced component and has some limitations and performance considerations.
[See below for more information](#limitations-and-performance-considerations).

`CellMeasurer` can be used with `Grid`, `List`, and `Table` components. It is not intended to be used with the `Collection` component.

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| cache | `CellMeasurerCache` | ✓ | Cache to be shared between `CellMeasurer` and its parent `Grid`. Learn more [here](#cellmeasurercache). |
| children | Element or Function | ✓ | Either a React element as a child (eg `<div />`) or a function (eg. `({ measure }) => <div />`). See [below](#using-cellmeasurer-with-images) for more detailed examples. |
| columnIndex | number | ✓ | Index of column being measured (within the parent `Grid`) or 0 (if used within a `List` or `Table`). |
| parent | `Grid` | ✓ | Reference to the parent `Grid`; this value is passed by `Grid` to the `cellRenderer` and should be passed along as-is. |
| rowIndex | number | ✓ | Index of row being measured (within the parent `Grid`). |

### CellMeasurerCache

The `CellMeasurerCache` stores `CellMeasurer` measurements and shares them with a parent `Grid`.
It should be configured based on the type of measurements you need. It accepts the following parameters:

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| defaultHeight | number | | Umeasured cells will initially report this height |  
| defaultWidth | number | | Umeasured cells will initially report this width |
| fixedHeight | boolean | | Rendered cells will have a fixed height, dynamic width |
| fixedWidth | boolean | | Rendered cells will have a fixed width, dynamic height |
| minHeight | number | | Derived row height (of multiple cells) should not be less than this value |
| minWidth | number | | Derived column width (of multiple cells) should not be less than this value |
| keyMapper | KeyMapper | | Enables more intelligent mapping of a given column and row index to an item ID. This prevents a cell cache from being invalidated when its parent collection is modified. `(rowIndex: number, columnIndex: number) => any` |

Note that while all of the individual parameters above are optional, you must supply at least some of them.
`CellMeasurerCache` is not meant to measure cells that are both dynamic width _and_ height.
It would be inefficient to do so since the size of a row (or column) is equal to the largest cell within that row.
See [below](#limitations-and-performance-considerations) for more information.

### Public Methods

##### clear (rowIndex: number, columnIndex: number)
Reset cached data about a specific cell. This should be called when a cell needs to be re-measured to handle dynamic content. (eg. Rendering a loading indicator at the end of a series will cache its `rowIndex` and `columnIndex` to the height of the loading indicator. Once your actual data loads and replaces the loading indicator, you may need to use `clear()` to re-measure the cell that was previously occupied by the loading indicator.)

##### clearAll ()
Reset any cached data about already-loaded cells. This can be used in situations where your `Grid`, `List` or `Table` needs to reflow its content due to a resizing scenario. (eg. Window resizes and re-renders a responsive layout that may affect all cells.)

### Examples

###### Grid

This example shows a `Grid` with fixed row heights and dynamic column widths.
For more examples check out the component [demo page](https://bvaughn.github.io/react-virtualized/#/components/CellMeasurer).

```jsx
import React from 'react';
import { CellMeasurer, CellMeasurerCache, Grid } from 'react-virtualized';

// In this example, average cell width is assumed to be about 100px.
// This value will be used for the initial `Grid` layout.
// Cell measurements smaller than 75px should also be rounded up.
// Height is not dynamic.
const cache = new CellMeasurerCache({
  defaultWidth: 100,
  minWidth: 75,
  fixedHeight: true
});

function cellRenderer ({ columnIndex, key, parent, rowIndex, style }) {
  const content // Derive this from your data somehow

  return (
    <CellMeasurer
      cache={cache}
      columnIndex={columnIndex}
      key={key}
      parent={parent}
      rowIndex={rowIndex}
    >
      <div
        style={{
          ...style,
          height: 35,
          whiteSpace: 'nowrap'
        }}
      >
        {content}
      </div>
    </CellMeasurer>
  );
}

function renderGrid (props) {
  return (
    <Grid
      {...props}
      columnWidth={cache.columnWidth}
      deferredMeasurementCache={cache}
      cellRenderer={cellRenderer}
    />
  );
}
```

###### Using `CellMeasurer` with images

This example shows how you might use the `CellMeasurer` component along with the `List` component in order to display dynamic-height rows.
The difference between this example and the above example is that the height of the row is not determined until image data has loaded.
To support this, a function-child is passed to `CellMeasurer` which then receives a `measure` parameter.
`measure` should be called when cell content is ready to be measured (in this case, when the image has loaded).

```jsx
import React from 'react';
import { CellMeasurer, CellMeasurerCache, Grid } from 'react-virtualized';

// In this example, average cell height is assumed to be about 50px.
// This value will be used for the initial `Grid` layout.
// Width is not dynamic.
const cache = new CellMeasurerCache({
  defaultHeight: 50,
  fixedWidth: true
});

function rowRenderer ({ index, isScrolling, key, parent, style }) {
  const source // This comes from your list data

  return (
    <CellMeasurer
      cache={cache}
      columnIndex={0}
      key={key}
      parent={parent}
      rowIndex={index}
    >
      {({ measure }) => (
        // 'style' attribute required to position cell (within parent List)
        <div style={style}>
          <img
            onLoad={measure}
            src={source}
          />
        </div>
      )}
    </CellMeasurer>
  );
}

function renderList (props) {
  return (
    <List
      {...props}
      deferredMeasurementCache={cache}
      rowHeight={cache.rowHeight}
      rowRenderer={rowRenderer}
    />
  );
}
```

### Limitations and Performance Considerations

###### Performance

Measuring a column's width requires measuring all rows in order to determine the widest occurrence of that column.
The same is true in reverse for measuring a row's height.
For this reason it may not be a good idea to use this HOC for `Grid`s containing a large number of both columns _and_ cells.

Since this component measures one cell at a time to determine it's width/height, it will likely be slow if a user skips many rows (or columns) at once by scrolling with a scrollbar or via a scroll-to-cell prop.
There is (unfortunately) no workaround for this performance limitation at the moment.
