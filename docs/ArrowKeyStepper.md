## ArrowKeyStepper

High-order component that decorates another virtualized component and responds to arrow-key events by scrolling one row or column at a time.
This provides a snap-to behavior rather than the default browser scrolling behavior.

Note that unlike the other HOCs in react-virtualized, the `ArrowKeyStepper` adds a `<div>` element around its children in order to attach a key-down event handler.
The appearance of this wrapper element can be customized using the `className` property.

### Prop Types

| Property         | Type               | Required? | Description                                                                                                                                                                                                        |
| :--------------- | :----------------- | :-------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| children         | Function           |     ✓     | Function responsible for rendering children. This function should implement the following signature: `({ onSectionRendered: Function, scrollToColumn: number, scrollToRow: number }) => PropTypes.element`         |
| className        | String             |           | CSS class name to attach to the wrapper `<div>`.                                                                                                                                                                   |
| columnCount      | Number             |     ✓     | Number of columns in grid; for `Table` and `List` this property should always be `1`.                                                                                                                              |
| disabled         | Boolean            |           | Disables all scrolling using arrow-keys; defaults to `false`                                                                                                                                                       |
| isControlled     | Boolean            |           | This component is "controlled"; it will not update `scrollToColumn` or `scrollToRow`. This property should be used with `onScrollToChange`.                                                                        |
| mode             | "edges" or "cells" |           | Controls behavior of stepper when arrow key direction changes. "cells" means that the index will only increment or decrement by 1; "edges" (default) means that the opposite side of the grid will be incremented. |
| onScrollToChange | Function           |           | Called when arrow key navigation should update the current scroll-to values.                                                                                                                                       |
| rowCount         | Number             |     ✓     | Number of rows in grid.                                                                                                                                                                                            |
| scrollToColumn   | Number             |           | Optional default/initial `scrollToColumn` value                                                                                                                                                                    |
| scrollToRow      | Number             |           | Optional default/initial `scrollToRow` value                                                                                                                                                                       |

### Public Methods

##### setScrollIndexes ({ scrollToColumn: number, scrollToRow: number })

Override the local state of the component with new values for `scrollToRow` and `scrollToColumn`.

### Children function

The child function is passed the following named parameters:

| Parameter         | Type     | Description                                                                                                                  |
| :---------------- | :------- | :--------------------------------------------------------------------------------------------------------------------------- |
| onSectionRendered | Function | Pass-through callback to be attached to child component; informs the key-stepper which range of cells are currently visible. |
| scrollToColumn    | Number   | Specifies which column in the child component should be visible                                                              |
| scrollToRow       | Number   | Specifies which row in the child component should be visible                                                                 |

### Examples

You can decorate any virtualized component (eg. `Table`, `Grid`, or `List`) with arrow-key snapping like so:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import {ArrowKeyStepper, Grid} from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

ReactDOM.render(
  <ArrowKeyStepper columnCount={columnCount} rowCount={rowCount}>
    {({onSectionRendered, scrollToColumn, scrollToRow}) => (
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
  document.getElementById('example'),
);
```
