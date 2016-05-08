AutoSizer
---------------

High-order component that automatically adjusts the width and height of a single child.

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| children | Function | ✓ | Function respondible for rendering children. This function should implement the following signature: `({ height: number, width: number }) => PropTypes.element` |
| disableHeight | Boolean |  | Fixed `height`; if specified, the child's `height` property will not be managed |
| disableWidth | Boolean |  | Fixed `width`; if specified, the child's `width` property will not be managed |
| onResize | Function |  | Callback to be invoked on-resize; it is passed the following named parameters: `({ height: number, width: number })`. | 

### Examples

Many react-virtualized components require explicit dimensions but sometimes you just want a component to just grow to fill all of the available space.
The `AutoSizer` component can be useful in this case.
For example...

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { AutoSizer, VirtualScroll } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

// List data as an array of strings
const list = [
  'Brian Vaughn'
  // And so on...
];

// Render your list
ReactDOM.render(
  <AutoSizer>
    {({ height, width }) => (
      <VirtualScroll
        width={width}
        height={height}
        rowCount={list.length}
        rowHeight={20}
        rowRenderer={
          index => list[index] // Could also be a DOM element
        }
      />
    )}
  </AutoSizer>,
  document.getElementById('example')
);
```
