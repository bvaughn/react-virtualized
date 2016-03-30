ScrollSync
---------------

High order component that simplifies the process of synchronizing scrolling between two or more virtualized components.

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| children | Function | ✓ | Function responsible for rendering 2 or more virtualized components. This function should implement the following signature: `({ onScroll, scrollLeft, scrollTop }) => PropTypes.element` |

### Children function

The child function is passed the following named parameters:

| Parameter | Type | Description |
|:---|:---|:---|
| clientHeight | Number | Height of the visible portion of the `Grid` (or other scroll-synced component) |
| clientWidth | Number | Width of the visible portion of the `Grid` (or other scroll-synced component) |
| onScroll | Function | This function should be passed through to at least one of the virtualized child components. Updates to it will trigger updates to the scroll ofset parameters which will in turn update the other virtualized children. |
| scrollHeight | Number | Total height of all rows in the `Grid` (or other scroll-synced component) |
| scrollLeft | Number | The current scroll-left offset. |
| scrollTop | Number | The current scroll-top offset. |
| scrollWidth | Number | Total width of all rows in the `Grid` (or other scroll-synced component) |

### Examples

This example uses `ScrollSync` to create a fixed row of columns to go along with a scrollable grid.

```js
import { Grid, ScrollSync, VirtualScroll } from 'react-virtualized'
import 'react-virtualized/styles.css'; // only needs to be imported once

function render (props) {
  return (
    <ScrollSync>
      {({ clientHeight, clientWidth, onScroll, scrollHeight, scrollLeft, scrollTop, scrollWidth }) => (
        <div className='Table'>
          <div className='LeftColumn'>
            <VirtualScroll
              scrollTop={scrollTop}
              {...props}
            />
          </div>
          <div className='RightColumn'>
            <Grid
              onScroll={onScroll}
              {...props}
            />
          </div>
        </div>
      )}
    </ScrollSync>
  )
}
```
