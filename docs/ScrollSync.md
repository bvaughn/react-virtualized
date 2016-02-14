ScrollSync
---------------

High order component that simplifies the process of synchronizing scrolling between two or more virtualized components.

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| children | PropTypes.Element | ✓ | Function respondible for rendering 2 or more virtualized components. This function should implement the following signature: `({ onScroll, scrollLeft, scrollTop }) => PropTypes.element` |

### Example

This example uses `ScrollSync` to create a fixed row of columns to go along with a scrollable grid.

```js
import { Grid, ScrollSync, VirtualScroll } from 'react-virtualized'

function render () {
  return (
    <ScrollSync>
      {({ onScroll, scrollLeft, scrollTop }) => (
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
