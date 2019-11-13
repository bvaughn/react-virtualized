## AutoSizer

High-order component that automatically adjusts the width and height of a single child.

### Prop Types

| Property      | Type     | Required? | Description                                                                                                                                                     |
| :------------ | :------- | :-------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| children      | Function |     ✓     | Function responsible for rendering children. This function should implement the following signature: `({ height: number, width: number }) => PropTypes.element` |
| className     | String   |           | Optional custom CSS class name to attach to root `AutoSizer` element. This is an advanced property and is not typically necessary.                              |
| defaultHeight | Number   |           | Height passed to child for initial render; useful for server-side rendering. This value will be overridden with an accurate height after mounting.              |
| defaultWidth  | Number   |           | Width passed to child for initial render; useful for server-side rendering. This value will be overridden with an accurate width after mounting.                |
| disableHeight | Boolean  |           | Fixed `height`; if specified, the child's `height` property will not be managed                                                                                 |
| disableWidth  | Boolean  |           | Fixed `width`; if specified, the child's `width` property will not be managed                                                                                   |
| nonce         | String   |           | Nonce of the inlined stylesheets for [Content Security Policy](https://www.w3.org/TR/2016/REC-CSP2-20161215/#script-src-the-nonce-attribute)                    |
| onResize      | Function |           | Callback to be invoked on-resize; it is passed the following named parameters: `({ height: number, width: number })`.                                           |
| style         | Object   |           | Optional custom inline style to attach to root `AutoSizer` element. This is an advanced property and is not typically necessary.                                |

### Examples

Many react-virtualized components require explicit dimensions but sometimes you just want a component to just grow to fill all of the available space.
The `AutoSizer` component can be useful in this case.

One word of caution about using `AutoSizer` with flexbox containers.
Flex containers don't prevent their children from growing and `AutoSizer` greedily grows to fill as much space as possible.
Combining the two can cause a loop.
The simple way to fix this is to nest `AutoSizer` inside of a `block` element (like a `<div>`) rather than putting it as a direct child of the flex container.
Read more about common `AutoSizer` questions [here](usingAutoSizer.md).

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import {AutoSizer, List} from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

// List data as an array of strings
const list = [
  'Brian Vaughn',
  // And so on...
];

function rowRenderer({key, index, style}) {
  return (
    <div key={key} style={style}>
      {list[index]}
    </div>
  );
}

// Render your list
ReactDOM.render(
  <AutoSizer>
    {({height, width}) => (
      <List
        height={height}
        rowCount={list.length}
        rowHeight={20}
        rowRenderer={rowRenderer}
        width={width}
      />
    )}
  </AutoSizer>,
  document.getElementById('example'),
);
```
