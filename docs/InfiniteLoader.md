InfiniteLoader
---------------

High-order component that manages just-in-time fetching of data as a user scrolls up or down in a list.

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| children | Function | ✓ | Function respondible for rendering a virtualized components. This function should implement the following signature: `({ onRowsRendered, registerChild }) => PropTypes.element` |
| isRowLoaded | Function | ✓ | Function responsible for tracking the loaded state of each row. It should implement the following signature: `(index: number): boolean` |
| loadMoreRows | Function | ✓ | Callback to be invoked when more rows must be loaded. It should implement the following signature: `({ startIndex, stopIndex }): Promise`. The returned Promise should be resolved once row data has finished loading. It will be used to determine when to refresh the list with the newly-loaded data. This callback may be called multiple times in reaction to a single scroll event. |
| rowsCount | Number | ✓ | Number of rows in list; can be arbitrary high number if actual number is unknown. |
| threshold | Number |  | Threshold at which to pre-fetch data. A threshold X means that data will start loading when a user scrolls within X rows. This value defaults to 15. |

### Children function

The child function is passed the following named parameters:

| Parameter | Type | Description |
|:---|:---|:---:|
| onRowsRendered | Function | This function should be passed as the child's `onRowsRendered` property. It informs the loader when the user is scrolling. |
| registerChild | Function | This function should be set as the child's `ref` property. It enables a set of rows to be refreshed once their data has finished loading. |

### Example

This example uses `InfiniteLoader` to prefetch rows in a virtual list as a user scrolls.

```js
import { InfiniteLoader, VirtualScroll } from 'react-virtualized'

function render (props) {
  return (
    <InfiniteLoader {...infiniteLoaderProps}>
      {({ onRowsRendered, registerChild }) => (
        <VirtualScroll
          ref={registerChild}
          onRowsRendered={onRowsRendered}
          {...virtualScrollProps}
        />
      )}
    </InfiniteLoader>
  )
}
```
