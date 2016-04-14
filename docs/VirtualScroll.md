VirtualScroll
---------------

This component renders a virtualized list of elements with either fixed or dynamic heights.

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| className | String |  | CSS class name |
| height | Number | ✓ | Height constraint for list (determines how many actual rows are rendered) |
| noRowsRenderer | Function |  | Callback used to render placeholder content when `rowsCount` is 0 |
| onRowsRendered | Function |  | Callback invoked with information about the slice of rows that were just rendered: `({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex }): void` |
| onScroll | Function |  | Callback invoked whenever the scroll offset changes within the inner scrollable region: `({ clientHeight, scrollHeight, scrollTop }): void` |
| overscanRowsCount | Number |  | Number of rows to render above/below the visible bounds of the list. This can help reduce flickering during scrolling on certain browers/devices. |
| rowHeight | Number or Function | ✓ | Either a fixed row height (number) or a function that returns the height of a row given its index: `(index: number): number` |
| rowRenderer | Function | ✓ | Responsbile for rendering a row given an index. Signature should look like `(index: number): React.PropTypes.node` |
| rowsCount | Number | ✓ | Number of rows in list. |
| scrollToIndex | Number |  | Row index to ensure visible (by forcefully scrolling if necessary) |
| scrollTop | Number |  | Vertical offset |
| width | Number | ✓ | Width of the list |

### Public Methods

##### recomputeRowHeights
Recompute row heights and offsets.

VirtualScroll has no way of knowing when its underlying list data has changed since it only receives a `rowHeight` property. If the `rowHeight` is a number it can compare before and after values but if it is a function that comparison is error prone. In the event that a dynamic `rowHeight` function is in use and the row heights have changed this function should be manually called by the "smart" container parent.

### Class names

The VirtualScroll component supports the following static class names

| Property | Description |
|:---|:---|
| VirtualScroll | Main (outer) element |
| VirtualScroll__innerScrollContainer | Inner element on which virtual items are positioned |
| VirtualScroll__row | Individual row |

### Examples

Below is a simple `VirtualScroll` example. Each row in the virtualized list is rendered through the use of a `rowRenderer` function for performance reasons. This function must return an element with a unique `key` and must fit within the specified `rowHeight`.

**Note** that it is very important that rows do not have vertical overflow.
It would make scrolling the list difficult (as individual items will intercept the scroll events).
For this reason it is recommended that your rows use a style like `overflow-y: hidden`.)

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { VirtualScroll } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

// List data as an array of strings
const list = [
  'Brian Vaughn'
  // And so on...
];

// Render your list
ReactDOM.render(
  <VirtualScroll
    width={300}
    height={300}
    rowsCount={list.length}
    rowHeight={20}
    rowRenderer={
      index => list[index] // Could also be a DOM element
    }
  />,
  document.getElementById('example')
);
```
