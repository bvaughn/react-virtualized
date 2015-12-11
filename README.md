<img src="https://cloud.githubusercontent.com/assets/29597/11737732/0ca1e55e-9f91-11e5-97f3-098f2f8ed866.png" alt="React virtualized" data-canonical-src="https://cloud.githubusercontent.com/assets/29597/11737732/0ca1e55e-9f91-11e5-97f3-098f2f8ed866.png" width="330" height="100" />

<img src="https://circleci.com/gh/bvaughn/react-virtualized.svg?style=shield&circle-token=:circle-token" alt="Circle CI badge">

Demos available here:
http://bvaughn.github.io/react-virtualized/

Getting started
---------------

Install `react-virtualized` using npm.

```shell
npm install react-virtualized --save
```

Documentation
---------------

API documentation available [here](docs/README.md).

Examples
---------------

#### VirtualScroll Example

Below is a simple `VirtualScroll` example. Each row in the virtualized list is rendered through the use of a `rowRenderer` function for performance reasons. This function must return an element with a unique `key` and must fit within the specified `rowHeight`.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { VirtualScroll } from 'react-virtualized';

// List data as an array of strings
const list = [
  'Brian Vaughn'
  // And so on...
];

// Render your list
ReactDOM.render(
  <VirtualScroll
    width={300}
    height={300}
    rowsCount={list.length}
    rowHeight={20}
    rowRenderer={
      index => (
        <div key={index}>
          {list[index]}
        </div>
      )
    }
  />,
  document.getElementById('example')
);
```

#### FlexTable Example

Below is a very basic `FlexTable` example. This table has only 2 columns, each containing a simple string. Both have a fixed width and neither is sortable. [See here](blob/master/source/FlexTable/FlexTable.example.js) for a more full-featured example including custom cell renderers, sortable headers, and more.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { FlexTable, FlexColumn } from 'react-virtualized';

// Table data as a array of objects
const list = [
  { name: 'Brian Vaughn', description: 'Software engineer' }
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

Changes are tracked in the [changelog](https://github.com/bvaughn/react-virtualized/blob/master/CHANGELOG.md).

License
---------

*react-virtualized* is available under the MIT License.
