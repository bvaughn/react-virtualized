Collection
---------------

Renders scattered or non-linear data.
Unlike `Grid`, which renders checkerboard data, `Collection` can render arbitrarily positioned- even overlapping- data.

**Note** that this component's measuring and layout phase is more expensive than `Grid` since it can not assume a correlation between a cell's index and position. For this reason it will take signifnicantly longer to initialize than the more linear/checkerboard components.

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| className | String |  | Optional custom CSS class name to attach to root Collection element. |
| cellCount | Number | ✓ | Number of cells in collection. |
| cellGroupRenderer | Function | ✓ | Responsible for rendering a group of cells given their indices.: `({ cellSizeAndPositionGetter:Function, indices: Array<number>, cellRenderer: Function }): Array<PropTypes.node>` |
| cellRenderer | Function | ✓ | Responsible for rendering a cell given an row and column index: `({ index: number, isScrolling: boolean }): PropTypes.element` |
| cellSizeAndPositionGetter | Function | ✓ | Callback responsible for returning size and offset/position information for a given cell (index): `({ index: number }): { height: number, width: number, x: number, y: number }` |
| height | Number | ✓ | Height of Collection; this property determines the number of visible (vs virtualized) rows. |
| noContentRenderer | Function |  | Optional renderer to be rendered inside the grid when `cellCount` is 0: `(): PropTypes.node` |
| onSectionRendered | Function |  | Callback invoked with information about the section of the Collection that was just rendered: `({ indices: Array<number> }): void` |
| onScroll | Function |  | Callback invoked whenever the scroll offset changes within the inner scrollable region: `({ clientHeight: number, clientWidth: number, scrollHeight: number, scrollLeft: number, scrollTop: number, scrollWidth: number }): void` |
| scrollLeft | Number |  | Horizontal offset |
| scrollToCell | Number |  | Cell index to ensure visible (by scrolling if necessary) |
| scrollTop | Number |  | Vertical offset |
| sectionSize | Number |  | Optionally override the size of the sections a Collection's cells are split into. This is an advanced option and should only be used for performance tuning purposes. |
| style | Object |  | Optional custom inline style to attach to root Collection element. |
| width | Number | ✓ | Width of Collection; this property determines the number of visible (vs virtualized) columns. |

### Public Methods

##### recomputeCellSizesAndPositions

Recomputes cell sizes and positions.

This function should be called if cell sizes or positions have changed but nothing else has.
Since Collection only receives `cellCount` (and not the underlying List or Array) it has no way of detecting when the underlying data changes.

### Class names

The Collection component supports the following static class names

| Property | Description |
|:---|:---|
| Collection | Main (outer) element |
| Collection__innerScrollContainer | Inner scrollable area |
| Collection__cell | Individual cell |

### Examples

Below is a very basic `Collection` example. It displays an array of objects with fixed row and column sizes.
[See here](../source/Collection/Collection.example.js) for a more full-featured example.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Collection } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

// Collection data as an array of arrays
const list = [
  { name: 'Brian Vaughn', x: 13, y: 34, width: 123, size: 234 }
  // And so on...
];

// Render your grid
ReactDOM.render(
  <Collection
    cellCount={list.length}
    cellRenderer={({ index }) => list[index].name}
    cellSizeAndPositionGetter={({ index }) => {
      const datum = list[index]
      return {
        height: datum.height,
        width: datum.width,
        x: datum.x,
        y: datum.y
      }
    }}
    height={300}
    width={300}
  />,
  document.getElementById('example')
);
```
