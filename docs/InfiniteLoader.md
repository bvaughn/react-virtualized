InfiniteLoader
---------------

High-order component that manages just-in-time fetching of data as a user scrolls up or down in a list.

Note that this component is inteded to assist with row-loading.
As such it is best suited for use with `FlexTable` and `VirtualScroll` (although it can also be used with `Grid`).
This HOC is not compatible with the `Collection` component.

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| children | Function | ✓ | Function responsible for rendering a virtualized component. This function should implement the following signature: `({ onRowsRendered: Function, registerChild: Function }) => PropTypes.element` |
| isRowLoaded | Function | ✓ | Function responsible for tracking the loaded state of each row. It should implement the following signature: `({ index: number }): boolean` |
| loadMoreRows | Function | ✓ | Callback to be invoked when more rows must be loaded. It should implement the following signature: `({ startIndex: number, stopIndex: number }): Promise`. The returned Promise should be resolved once row data has finished loading. It will be used to determine when to refresh the list with the newly-loaded data. This callback may be called multiple times in reaction to a single scroll event. |
| minimumBatchSize | Number |  | Minimum number of rows to be loaded at a time. This property can be used to batch requests to reduce HTTP requests. Defaults to `10`. |
| rowCount | Number | ✓ | Number of rows in list; can be arbitrary high number if actual number is unknown. |
| threshold | Number |  | Threshold at which to pre-fetch data. A threshold X means that data will start loading when a user scrolls within X rows. Defaults to `15`. |

### Children function

The child function is passed the following named parameters:

| Parameter | Type | Description |
|:---|:---|:---|
| onRowsRendered | Function | This function should be passed as the child's `onRowsRendered` property. It informs the loader when the user is scrolling. |
| registerChild | Function | This function should be set as the child's `ref` property. It enables a set of rows to be refreshed once their data has finished loading. |

### Examples

This example uses `InfiniteLoader` to prefetch rows in a `VirtualScroll` list as a user scrolls.
An interactive demo can be seen [here](https://bvaughn.github.io/react-virtualized/?component=InfiniteLoader).

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { InfiniteLoader, VirtualScroll } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

const list = [];

function isRowLoaded ({ index }) {
  return !!list[index];
}

function loadMoreRows ({ startIndex, stopIndex }) {
  return fetch(`path/to/api?startIndex=${startIndex}&stopIndex=${stopIndex}`)
    .then(response => {
      // Store response data in list...
    })
}

// Render your list
ReactDOM.render(
  <InfiniteLoader
    isRowLoaded={isRowLoaded}
    loadMoreRows={loadMoreRows}
    rowCount={remoteRowCount}
  >
    {({ onRowsRendered, registerChild }) => (
      <VirtualScroll
        ref={registerChild}
        width={300}
        height={200}
        onRowsRendered={onRowsRendered}
        rowCount={list.length}
        rowHeight={20}
        rowRenderer={
          ({ index }) => list[index] // Could also be a DOM element
        }
      />
    )}
  </InfiniteLoader>,
  document.getElementById('example')
);
```
