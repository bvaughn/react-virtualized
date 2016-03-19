ArrowKeyStepper
---------------

High-order component that decorates another virtualized component and responds to arrow-key events by scrolling one row or column at a time.
This provides a snap-to behavior rather than the default browser scrolling behavior.

Note that unlike the other HOCs in react-virtualized, the `ArrowKeyStepper` adds a `<div>` element around its children in order to attach a key-down event handler.
The appearance of this wrapper element can be customized using the `className` property.

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| children | Function | ✓ | Function respondible for rendering children. This function should implement the following signature: `({ onKeyDown, onSectionRendered, scrollToColumn, scrollToRow }) => PropTypes.element` |
| className | String |  | CSS class name to attach to the wrapper `<div>`. |
| columnsCount | Number | ✓ | Number of columns in grid; for `FlexTable` and `VirtualScroll` this property should always be `1`. |
| rowsCount | Number | ✓ | Number of rows in grid. |

### Children function

The child function is passed the following named parameters:

| Parameter | Type | Description |
|:---|:---|:---:|
| onKeyDown | Function | Key-down event handler to be attached to the DOM hierarchy. |
| onSectionRendered | Function | Pass-through callback to be attached to child component; informs the key-stepper which range of cells are currently visible. |
| scrollToColumn | Number | Specifies which column in the child component should be visible |
| scrollToRow | Number | Specifies which row in the child component should be visible |

### Examples

You can decorate any virtualized component (eg. `FlexTable`, `Grid`, or `VirtualScroll`) with arrow-key snapping like so:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { ArrowKeyStepper, Grid } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

ReactDOM.render(
  <ArrowKeyStepper
    columnsCount={columnsCount}
    rowsCount={rowsCount}
  >
    {({ onKeyDown, onSectionRendered, scrollToColumn, scrollToRow }) => (
      <div onKeyDown={onKeyDown}>
        <Grid
          columnsCount={columnsCount}
          onSectionRendered={onSectionRendered}
          rowsCount={rowsCount}
          scrollToColumn={scrollToColumn}
          scrollToRow={scrollToRow}
          {...otherGridProps}
        />
      </div>
    )}
  </ArrowKeyStepper>,
  document.getElementById('example')
);
```
