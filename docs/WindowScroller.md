WindowScroller
---------------

High-order component that enables a `Table` or `List` component to be scrolled based on the window's scroll positions.
This can be used to create layouts similar to Facebook or Twitter news feeds.

**Note** that this HOC does not currently work with a horizontally-scrolling `Grid` as horizontal scrolls reset the internal `scrollTop`.
This may change with a future release but for the time being this HOC is should be used with `Table` or `List` only.

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| children | Function | ✓ | Function responsible for rendering children. This function should implement the following signature: `({ height: number, isScrolling: boolean, scrollTop: number }) => PropTypes.element` |
| onResize | Function |  | Callback to be invoked on-resize; it is passed the following named parameters: `({ height: number, width: number })`. |
| onScroll | Function |  | Callback to be invoked on-scroll; it is passed the following named parameters: `({ scrollTop: number, scrollLeft: number })`. |
| scrollElement | any |  | Element to attach scroll event listeners. Defaults to `window`. |

### Public Methods

##### updatePosition

Recalculates scroll position from the top of page.

This method is automatically triggered when the component mounts as well as when the browser resizes. It should be manually called if the page header (eg any items in the DOM "above" the `WindowScroller`) resizes or changes.

### Examples

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { List, WindowScroller } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

ReactDOM.render(
  <WindowScroller>
    {({ height, isScrolling, scrollTop }) => (
      <List
        autoHeight
        height={height}
        isScrolling={isScrolling}
        rowCount={...}
        rowHeight={...}
        rowRenderer={...}
        scrollTop={scrollTop}
        width={...}
      />
    )}
  </WindowScroller>,
  document.getElementById('example')
);
```
