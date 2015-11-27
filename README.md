Demos available here:
http://bvaughn.github.io/react-virtualized/

Getting started
---------------

Install `react-virtualized` using npm.

```shell
npm install react-virtualized --save
```

### VirtualScroll Example

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { VirtualScroll } from 'react-virtualized';

// Table data as a list of array.
const list = [
  1, 2, 3, 4, 5, 6
  // And so on...
];

// Render your table
ReactDOM.render(
  <VirtualScroll
    width={300}
    height={300}
    rowsCount={list.size}
    rowHeight={20}
    rowRenderer={index => `Row ${list[index]}`}
  />,
  document.getElementById('example')
);
```

### FlexTable Example

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { FlexTable, FlexColumn } from 'react-virtualized';

// Table data as a list of array.
const list = [
  { name: 'Brian Vaughn', description: 'Software engineer'
  // And so on...
];

// Render your table
ReactDOM.render(
  <FlexTable
    width={300}
    height={300}
    headerHeight={20}
    rowHeight={30}
    rowsCount={list.length}
    rowGetter={index => list[index]}
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
  </FlexTable>,
  document.getElementById('example')
);
```

Contributions
------------

Use [GitHub issues](https://github.com/bvaughn/react-virtualized/issues) for requests.

I actively welcome pull requests; learn how to [contribute](https://github.com/bvaughn/react-virtualized/blob/master/CONTRIBUTING.md).

Changelog
---------

Changes are tracked in the [changelog](https://github.com/bvaughn/react-virtualized/CHANGELOG.md).

License
---------

*react-virtualized* is available under the MIT License.
