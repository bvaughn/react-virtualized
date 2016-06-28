SelectableGridComponent
-----------------------

High-order component that decorates a FlexTable and allows to have selection behavior on the component.

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
|allowsMultipleSelection| bool| | Boolean to set if the table accepts or not multiple selection |
| children | Function | ✓ | Function responsible for rendering children. This function should implement the following signature: `({ onRowClick: Function }) => PropTypes.element` |
| onRowSelect | Function | | Callback called when a row is selected. Function signature `({index}): void` |
| onRowDeselect | Function | | Callback called when a row is deselected. Function signature `({index}): void` |
| onSelectionIndexesForProposedSelection | Function | | Callback called when a row is select. It can be used to change the future selected rows. In this callback you could get the set 1,2,3 but returns 5,6 to select the rows 5 and 6. Function signature `({indexes}): PropTypes.object` |
| rowCount | Number | ✓ | Number of rows in grid. |

### Children function

The child function is passed the following named parameters:

| Parameter | Type | Description |
|:---|:---|:---|
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
    onRowSelect={({ index }) => console.error('Selected Index : ' + index.index)}
    onRowDeselect={({ index }) => console.error('Deselected Index : ' + index.index)}
  >
  {({ onRowClick }) => (
    <FlexTable
      onRowClick={(index, event) => {
        onRowClick(index, event)
      }}
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
