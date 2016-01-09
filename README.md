<img src="https://cloud.githubusercontent.com/assets/29597/11737732/0ca1e55e-9f91-11e5-97f3-098f2f8ed866.png" alt="React virtualized" data-canonical-src="https://cloud.githubusercontent.com/assets/29597/11737732/0ca1e55e-9f91-11e5-97f3-098f2f8ed866.png" width="330" height="100" />

![NPM version](https://img.shields.io/npm/v/react-virtualized.svg)
![NPM license](https://img.shields.io/npm/l/react-virtualized.svg)
![NPM total downloads](https://img.shields.io/npm/dt/react-virtualized.svg)
![NPM monthly downloads](https://img.shields.io/npm/dm/react-virtualized.svg)
[![Circle CI badge](https://img.shields.io/circleci/project/bvaughn/react-virtualized/master.svg)](https://circleci.com/gh/bvaughn/react-virtualized)

### Demos available here: http://bvaughn.github.io/react-virtualized/

Getting started
---------------

Install `react-virtualized` using npm.

```shell
npm install react-virtualized --save
```

Documentation
---------------

API documentation available [here](docs/README.md).

### Customizing Styles

React virtual CSS styles are split into two groups: functional styles (eg. `position`, `overflow`) and presentational styles (eg. `text-transform`, `color`). Both are defined as inline styles (rather than external CSS) to simplify usage for universal/isomorphic rendering.

Functional styles cannot be overridden but you can override presentational styles in a variety of ways:

###### Styling a single component

Supply a custom `styleSheet` to a component (eg. `<VirtualScroll styleSheet={...}/>`) to override default styles for a single component instance. Styles injected as properties will be automatically processed to add vendor prefixes.

Learn more about which styles a component supports in the [API docs](https://github.com/bvaughn/react-virtualized/blob/master/docs/).

###### Styling all instances

Override the static `defaultStyleSheet` property of a component class (eg. `FlexTable.defaultStyleSheet = {...}` to customize styles for all instances.

###### Global CSS
Load an external CSS file that defines global classes (eg. `FlexTable`, `FlexTable__row`) to append to default inline styles.

Learn more about which class names a component supports in the [API docs](https://github.com/bvaughn/react-virtualized/blob/master/docs/).

###### CSS Modules
If you are using CSS modules you can specify custom class names to be appended to a component instance (eg. `FlexTable` supports `className`, `headerClassName`, and `rowClassName` properties).

Learn more about which class names are supported in the [API docs](https://github.com/bvaughn/react-virtualized/blob/master/docs/).

Examples
---------------

#### VirtualScroll Example

Below is a simple `VirtualScroll` example. Each row in the virtualized list is rendered through the use of a `rowRenderer` function for performance reasons. This function must return an element with a unique `key` and must fit within the specified `rowHeight`.

**Note** that it is very important that rows do not have vertical overflow. This will make scrolling the list difficult (as individual items will intercept the scroll events). For this reason it is recommended that your rows use a style like `overflow-y: hidden`.)

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { VirtualScroll } from 'react-virtualized';
import 'react-virtualized/theme.css'; // Recommended presentational styles

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
import 'react-virtualized/theme.css'; // Recommended presentational styles

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

#### Autosizer Example
`VirtualScroll` and `FlexTable` require explicit dimensions but sometimes you just want a component to just grow to fill all of the available space. In that case you should use the `AutoSizer` component. Building on the `VirtualScroll` example above...

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { AutoSizer, VirtualScroll } from 'react-virtualized';
import 'react-virtualized/theme.css'; // Recommended presentational styles

// List data as an array of strings
const list = [
  'Brian Vaughn'
  // And so on...
];

// Render your list
ReactDOM.render(
  <AutoSizer>
    <VirtualScroll
      height={0}
      rowsCount={list.length}
      rowHeight={20}
      rowRenderer={
        index => (
          <div key={index}>
            {list[index]}
          </div>
        )
      }
    />
  </AutoSizer>,
  document.getElementById('example')
);
```

Note that in this example we initialize `height` to 0. (We do this because it is a required property and React will warn in dev mode if we leave it off.) However the `AutoSizer` wrapper component will inject a valid height for us.

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


Note that in this example we initialize `height` to 0. (We do this because it is a required property and React will warn in dev mode if we leave it off.) However the `AutoSizer` wrapper component will inject a valid height for us.

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
