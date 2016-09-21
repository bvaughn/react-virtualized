ArrowKeyStepper
---------------

High-order component that decorates another virtualized component and responds to arrow-key events by scrolling one row or column at a time.
This provides a snap-to behavior rather than the default browser scrolling behavior.

Note that unlike the other HOCs in react-virtualized, the `ArrowKeyStepper` adds a `<div>` element around its children in order to attach a key-down event handler.
The appearance of this wrapper element can be customized using the `className` property.

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| children | Function | ✓ | Function responsible for rendering children. This function should implement the following signature: `({ onSectionRendered: Function, scrollToColumn: number, scrollToRow: number }) => PropTypes.element` |
| className | String |  | CSS class name to attach to the wrapper `<div>`. |
| columnCount | Number | ✓ | Number of columns in grid; for `Table` and `List` this property should always be `1`. |
| rowCount | Number | ✓ | Number of rows in grid. |

### Children function

The child function is passed the following named parameters:

| Parameter | Type | Description |
|:---|:---|:---|
| onSectionRendered | Function | Pass-through callback to be attached to child component; informs the key-stepper which range of cells are currently visible. |
| scrollToColumn | Number | Specifies which column in the child component should be visible |
| scrollToRow | Number | Specifies which row in the child component should be visible |

### Examples

You can decorate any virtualized component (eg. `Table`, `Grid`, or `List`) with arrow-key snapping like so:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { ArrowKeyStepper, Grid } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

ReactDOM.render(
  <ArrowKeyStepper
    columnCount={columnCount}
    rowCount={rowCount}
  >
    {({ onSectionRendered, scrollToColumn, scrollToRow }) => (
      <Grid
        columnCount={columnCount}
        onSectionRendered={onSectionRendered}
        rowCount={rowCount}
        scrollToColumn={scrollToColumn}
        scrollToRow={scrollToRow}
        {...otherGridProps}
      />
    )}
  </ArrowKeyStepper>,
  document.getElementById('example')
);
```
