## List

This component renders a windowed list (rows) of elements.
It uses a `Grid` internally to render the rows and all props are relayed to that inner `Grid`.
That means that `List` also accepts [`Grid` props](Grid.md) in addition to the props shown below.

### Prop Types

| Property          | Type               | Required? | Description                                                                                                                                                                                                                                                                                               |
| :---------------- | :----------------- | :-------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| autoHeight        | Boolean            |           | Outer `height` of `List` is set to "auto". This property should only be used in conjunction with the `WindowScroller` HOC.                                                                                                                                                                                |
| className         | String             |           | Optional custom CSS class name to attach to root `List` element.                                                                                                                                                                                                                                          |
| estimatedRowSize  | Number             |           | Used to estimate the total height of a `List` before all of its rows have actually been measured. The estimated total height is adjusted as rows are rendered.                                                                                                                                            |
| height            | Number             |     ✓     | Height constraint for list (determines how many actual rows are rendered)                                                                                                                                                                                                                                 |
| id                | String             |           | Optional custom id to attach to root `List` element.                                                                                                                                                                                                                                                      |
| noRowsRenderer    | Function           |           | Callback used to render placeholder content when `rowCount` is 0                                                                                                                                                                                                                                          |
| onRowsRendered    | Function           |           | Callback invoked with information about the slice of rows that were just rendered: `({ overscanStartIndex: number, overscanStopIndex: number, startIndex: number, stopIndex: number }): void`                                                                                                             |
| onScroll          | Function           |           | Callback invoked whenever the scroll offset changes within the inner scrollable region: `({ clientHeight: number, scrollHeight: number, scrollTop: number }): void`                                                                                                                                       |
| overscanRowCount  | Number             |           | Number of rows to render above/below the visible bounds of the list. This can help reduce flickering during scrolling on certain browsers/devices. See [here](overscanUsage.md) for an important note about this property.                                                                                |
| rowCount          | Number             |     ✓     | Number of rows in list.                                                                                                                                                                                                                                                                                   |
| rowHeight         | Number or Function |     ✓     | Either a fixed row height (number) or a function that returns the height of a row given its index: `({ index: number }): number`                                                                                                                                                                          |
| rowRenderer       | Function           |     ✓     | Responsible for rendering a row. [Learn more](#rowrenderer).                                                                                                                                                                                                                                              |
| scrollToAlignment | String             |           | Controls the alignment scrolled-to-rows. The default ("_auto_") scrolls the least amount possible to ensure that the specified row is fully visible. Use "_start_" to always align rows to the top of the list and "_end_" to align them bottom. Use "_center_" to align them in the middle of container. |
| scrollToIndex     | Number             |           | Row index to ensure visible (by forcefully scrolling if necessary)                                                                                                                                                                                                                                        |
| scrollTop         | Number             |           | Forced vertical scroll offset; can be used to synchronize scrolling between components                                                                                                                                                                                                                    |
| style             | Object             |           | Optional custom inline style to attach to root `List` element.                                                                                                                                                                                                                                            |
| tabIndex          | Number             |           | Optional override of tab index default; defaults to `0`.                                                                                                                                                                                                                                                  |
| width             | Number             |     ✓     | Width of the list                                                                                                                                                                                                                                                                                         |

### Public Methods

##### forceUpdateGrid

Forcefully re-render the inner `Grid` component.

Calling `forceUpdate` on `List` may not re-render the inner `Grid` since it uses `shallowCompare` as a performance optimization.
Use this method if you want to manually trigger a re-render.
This may be appropriate if the underlying row data has changed but the row sizes themselves have not.

##### getOffsetForRow ({ alignment: ?string, index: ?number })

Gets offset for a given row and alignment.

##### measureAllRows

Pre-measure all rows in a `List`.

Typically rows are only measured as needed and estimated heights are used for cells that have not yet been measured.
This method ensures that the next call to getTotalSize() returns an exact size (as opposed to just an estimated one).

##### recomputeRowHeights (index: number)

Recompute row heights and offsets after the specified index (defaults to 0).

`List` has no way of knowing when its underlying list data has changed since it only receives a `rowHeight` property.
If the `rowHeight` is a number it can compare before and after values but if it is a function that comparison is error prone.
In the event that a dynamic `rowHeight` function is in use and the row heights have changed this function should be manually called by the "smart" container parent.

This method will also force a render cycle (via `forceUpdate`) to ensure that the updated measurements are reflected in the rendered list.

##### scrollToPosition (scrollTop: number)

Scroll to the specified offset.
Useful for animating position changes.

##### scrollToRow (index: number)

Ensure row is visible.
This method can be used to safely scroll back to a cell that a user has scrolled away from even if it was previously scrolled to.

### rowRenderer

Responsible for rendering a single row, given its index.
This function accepts the following named parameters:

```jsx
function rowRenderer({
  index, // Index of row
  isScrolling, // The List is currently being scrolled
  isVisible, // This row is visible within the List (eg it is not an overscanned row)
  key, // Unique key within array of rendered rows
  parent, // Reference to the parent List (instance)
  style, // Style object to be applied to row (to position it);
  // This must be passed through to the rendered row element.
}) {
  const user = list[index];

  // If row content is complex, consider rendering a light-weight placeholder while scrolling.
  const content = isScrolling ? '...' : <User user={user} />;

  // Style is required since it specifies how the row is to be sized and positioned.
  // React Virtualized depends on this sizing/positioning for proper scrolling behavior.
  // By default, the List component provides following style properties:
  //    position
  //    left
  //    top
  //    height
  //    width
  // You can add additional class names or style properties as you would like.
  // Key is also required by React to more efficiently manage the array of rows.
  return (
    <div key={key} style={style}>
      {content}
    </div>
  );
}
```

### Class names

The List component supports the following static class names

| Property                 | Description          |
| :----------------------- | :------------------- |
| ReactVirtualized\_\_List | Main (outer) element |

### Examples

Below is a simple `List` example. Each row in the virtualized list is rendered through the use of a `rowRenderer` function for performance reasons. This function must return an element that has a unique `key`, applies the `style` and has content fitting within `rowHeight`.

**Note** that it is very important that rows do not have vertical overflow.
It would make scrolling the list difficult (as individual items will intercept the scroll events).
For this reason it is recommended that your rows use a style like `overflow-y: hidden`.)

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import {List} from 'react-virtualized';

// List data as an array of strings
const list = [
  'Brian Vaughn',
  // And so on...
];

function rowRenderer({
  key, // Unique key within array of rows
  index, // Index of row within collection
  isScrolling, // The List is currently being scrolled
  isVisible, // This row is visible within the List (eg it is not an overscanned row)
  style, // Style object to be applied to row (to position it)
}) {
  return (
    <div key={key} style={style}>
      {list[index]}
    </div>
  );
}

// Render your list
ReactDOM.render(
  <List
    width={300}
    height={300}
    rowCount={list.length}
    rowHeight={20}
    rowRenderer={rowRenderer}
  />,
  document.getElementById('example'),
);
```
