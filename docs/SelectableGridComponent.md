SelectableGridComponent
-----------------------

High-order component that decorates a FlexTable and allows to have selection behavior on the component.

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
|allowsMultipleSelection| bool| | Boolean to set if the table accepts or not multiple selection |
| children | Function | ✓ | Function responsible for rendering children. This function should implement the following signature: `({ rowWrapperStyle: Function, onRowClick: Function }) => PropTypes.element` |
| onRowSelect | Function | | Callback called when a row is selected. Function signature `({index}): void` |
| onRowDeselect | Function | | Callback called when a row is deselected. Function signature `({index}): void` |
| onRowClick | Function |  | Callback invoked when a user clicks on a table row. `({ index: number }): void` |
| rowWrapperStyle | Object or Function |  | Optional custom inline style for `Grid__cell` elements. If function given then signature should be look like: ({ index: number }): PropTypes.object |
| onSelectionIndexesForProposedSelection | Function | | Callback called when a row is select. It can be used to change the future selected rows. In this callback you could get the set 1,2,3 but returns 5,6 to select the rows 5 and 6. Function signature `({indexes}): PropTypes.object` |
| rowCount | Number | ✓ | Number of rows in grid. |

### Children function

The child function is passed the following named parameters:

| Parameter | Type | Description |
|:---|:---|:---|
| rowWrapperStyle | Function | Pass-through callback to be attached to child component; catch the rowWrapperStyle callback and dispatch it. |
| onRowClick | Function | Pass-through callback to be attached to child component; catch the onRowClick callback and dispatch it. |

### Examples

You can decorate a FlexTable component with SelectableGridComponent snapping like so:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { SelectableGridComponent, FlexTable, FlexColumn } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

// Table data as a array of objects
const list = [
  { name: 'Brian Vaughn', description: 'Software engineer' }
  // And so on...
];

// Render your table
ReactDOM.render(
  <SelectableGridComponent
    allowsMultipleSelection
    onRowSelect={(index) => console.error('Selected Index : ' + index.index)}
    onRowDeselect={(index) => console.error('Deselected Index : ' + index.index)}
    rowWrapperStyle={(row) => {
      if (row.isSelected) return { backgroundColor: '#4DB6AD' }
      return { backgroundColor: 'white' }
    }}>
  {({ rowWrapperStyle, onRowClick }) => (
    <FlexTable
      onRowClick={onRowClick}
      rowWrapperStyle={rowWrapperStyle}
      width={300}
      height={300}
      headerHeight={20}
      rowHeight={30}
      rowCount={list.length}
      rowGetter={({index}) => list[index]}
    >
      <FlexColumn
        label='Name'
        dataKey='name'
        width={100}
      />
      <FlexColumn
        width={200}
        label='Description'
        dataKey='description'
      />
    </FlexTable>
  </SelectableGridComponent>,
  document.getElementById('example')
);
