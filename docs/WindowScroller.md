## WindowScroller

A component that enables a `Table` or `List` component to be scrolled based on the window's scroll positions.
This can be used to create layouts similar to Facebook or Twitter news feeds.

**Note** that this component does not currently work with a horizontally-scrolling `Grid` as horizontal scrolls reset the internal `scrollTop`.
This may change with a future release but for the time being this component should be used with `Table` or `List` only.

### Prop Types

| Property                   | Type     | Required? | Description                                                                                                                                                                                                                                                |
| :------------------------- | :------- | :-------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| children                   | Function |     ✓     | Function responsible for rendering children. This function should implement the following signature: `({ height: number, width: number, isScrolling: boolean, scrollTop: number, registerChild: function, onChildScroll: function }) => PropTypes.element` |
| onResize                   | Function |           | Callback to be invoked on-resize; it is passed the following named parameters: `({ height: number, width: number })`.                                                                                                                                      |
| onScroll                   | Function |           | Callback to be invoked on-scroll; it is passed the following named parameters: `({ scrollTop: number, scrollLeft: number })`.                                                                                                                              |
| scrollElement              | any      |           | Element to attach scroll event listeners. Defaults to `window`.                                                                                                                                                                                            |
| scrollingResetTimeInterval | Number   |           | Wait this amount of time after the last scroll event before resetting WindowScroller `pointer-events`; defaults to 150ms.                                                                                                                                  |
| serverHeight               | Number   |           | Height used for server-side rendering.                                                                                                                                                                                                                     |
| serverWidth                | Number   |           | Width used for server-side rendering.                                                                                                                                                                                                                      |

### Render Props

| Property      | Type     | Description                                                                                                |
| :------------ | :------- | :--------------------------------------------------------------------------------------------------------- |
| height        | Number   | The height of the viewport.                                                                                |
| isScrolling   | Boolean  | Indicates if the `Table` or `List` is scrolling                                                            |
| onChildScroll | Function | Used by the `Table` or `List`'s `onScroll` prop to "scroll" the list                                       |
| registerChild | Function | specify grid container deeper in layout (by default `WindowScroller` uses `ReactDOM.findDOMNode` function) |
| scrollTop     | Number   | Scroll distance from the page                                                                              |

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
    {({ height, isScrolling, onChildScroll, scrollTop }) => (
      <List
        autoHeight
        height={height}
        isScrolling={isScrolling}
        onScroll={onChildScroll}
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

using `registerChild`

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { List, WindowScroller } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

ReactDOM.render(
  <WindowScroller>
    {({ height, isScrolling, registerChild, scrollTop }) => (
      <div>
        <header>
          Table header
        </header>
        <div ref={registerChild}>
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
        </div>
      </div>
    )}
  </WindowScroller>,
  document.getElementById('example')
);
```
