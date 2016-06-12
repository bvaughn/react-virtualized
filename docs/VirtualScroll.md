VirtualScroll
---------------

This component renders a virtualized list of elements with either fixed or dynamic heights.

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| className | String |  | Optional custom CSS class name to attach to root `VirtualScroll` element. |
| estimatedRowSize | Number |  | Used to estimate the total height of a `VirtualScroll` before all of its rows have actually been measured. The estimated total height is adjusted as rows are rendered. |
| height | Number | ✓ | Height constraint for list (determines how many actual rows are rendered) |
| noRowsRenderer | Function |  | Callback used to render placeholder content when `rowCount` is 0 |
| onRowsRendered | Function |  | Callback invoked with information about the slice of rows that were just rendered: `({ overscanStartIndex: number, overscanStopIndex: number, startIndex: number, stopIndex: number }): void` |
| onScroll | Function |  | Callback invoked whenever the scroll offset changes within the inner scrollable region: `({ clientHeight: number, scrollHeight: number, scrollTop: number }): void` |
| overscanRowCount | Number |  | Number of rows to render above/below the visible bounds of the list. This can help reduce flickering during scrolling on certain browers/devices. |
| rowHeight | Number or Function | ✓ | Either a fixed row height (number) or a function that returns the height of a row given its index: `({ index: number }): number` |
| rowRenderer | Function | ✓ | Responsbile for rendering a row given an index. Signature should look like `({ index: number, isScrolling: boolean }): React.PropTypes.node` |
| rowCount | Number | ✓ | Number of rows in list. |
| rowClassName | String or Function |  | Optional custom CSS class name to attach to `Grid__cell` element. If function given then signature should be look like: ({index: number}): PropTypes.string |
| scrollToAlignment | String |  | Controls the alignment scrolled-to-rows. The default ("_auto_") scrolls the least amount possible to ensure that the specified row is fully visible. Use "_start_" to always align rows to the top of the list and "_end_" to align them bottom. Use "_center_" to align them in the middle of container. |
| scrollToIndex | Number |  | Row index to ensure visible (by forcefully scrolling if necessary) |
| scrollTop | Number |  | Forced vertical scroll offset; can be used to synchronize scrolling between components |
| style | Object |  | Optional custom inline style to attach to root `VirtualScroll` element. |
| width | Number | ✓ | Width of the list |

### Public Methods

##### measureAllRows
Pre-measure all rows in a `VirtualScroll`.

Typically rows are only measured as needed and estimated heights are used for cells that have not yet been measured.
This method ensures that the next call to getTotalSize() returns an exact size (as opposed to just an estimated one).

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
    rowCount={list.length}
    rowHeight={20}
    rowRenderer={
      ({ index, isScrolling }) => list[index] // Could also be a DOM element
    }
  />,
  document.getElementById('example')
);
```
