ScrollSync
---------------

High order component that simplifies the process of synchronizing scrolling between two or more virtualized components.

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| children | PropTypes.Element | ✓ | Function respondible for rendering 2 or more virtualized components. This function should implement the following signature: `({ onScroll, scrollLeft, scrollTop }) => PropTypes.element` |

### Children function

The child function is passed the following named parameters:

| Parameter | Type | Description |
|:---|:---|:---:|
| onScroll | Function | This function should be passed through to at least one of the virtualized child components. Updates to it will trigger updates to the scroll ofset parameters which will in turn update the other virtualized children. |
| scrollLeft | Number | The current left scroll offset. |
| scrollTop | Number | The current top scroll offset. |

### Examples

This example uses `ScrollSync` to create a fixed row of columns to go along with a scrollable grid.

```js
import { Grid, ScrollSync, VirtualScroll } from 'react-virtualized'

function render (props) {
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
