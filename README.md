<img src="https://cloud.githubusercontent.com/assets/29597/11737732/0ca1e55e-9f91-11e5-97f3-098f2f8ed866.png" alt="React virtualized" data-canonical-src="https://cloud.githubusercontent.com/assets/29597/11737732/0ca1e55e-9f91-11e5-97f3-098f2f8ed866.png" width="330" height="100" />

![NPM version](https://img.shields.io/npm/v/react-virtualized.svg?style=flat)
![NPM license](https://img.shields.io/npm/l/react-virtualized.svg?style=flat)
![NPM total downloads](https://img.shields.io/npm/dt/react-virtualized.svg?style=flat)
![NPM monthly downloads](https://img.shields.io/npm/dm/react-virtualized.svg?style=flat)
[![Circle CI badge](https://img.shields.io/circleci/project/bvaughn/react-virtualized/master.svg?style=flat)](https://circleci.com/gh/bvaughn/react-virtualized)
[![Codecov badge](https://img.shields.io/codecov/c/github/bvaughn/react-virtualized/master.svg)](https://codecov.io/github/bvaughn/react-virtualized)
[![Gitter](https://badges.gitter.im/bvaughn/react-virtualized.svg)](https://gitter.im/bvaughn/react-virtualized?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![PayPal donate button](https://img.shields.io/badge/paypal-donate-lightgray.svg?style=flat)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=5CVMYQKVPZC72)
[![Patreon donate button](https://img.shields.io/badge/patreon-donate%20once-lightgray.svg?style=flat)](https://www.patreon.com/user?u=2979769)

### Demos available here: http://bvaughn.github.io/react-virtualized/

Getting started
---------------

Install `react-virtualized` using npm.

```shell
npm install react-virtualized --save
```

ES6, CommonJS, and UMD builds are available with each distribution.
For example:

```js
// Make sure to import default styles.
// This only needs to be done once; probably during your application's bootstrapping process.
import 'react-virtualized/styles.css';

// Then you can import any react-virtualized components you need.
// Tree-shaking is supported with ES6 or CommonJS usage.
import { Grid } from 'react-virtualized'
```

Alternately you can load a global-friendly UMD build:

```html
<link rel="stylesheet" href="path-to-react-virtualized/styles.css">
<script src="path-to-react-virtualized/dist/umd/react-virtualized.js"></script>
```

Dependencies
---------------

React Virtualized has very few dependencies and most are managed by NPM automatically.
However the following peer dependencies must be specified by your project in order to avoid version conflicts:
[`react`](https://www.npmjs.com/package/react),
[`react-addons-shallow-compare`](https://www.npmjs.com/package/react-addons-shallow-compare), and
[`react-dom`](https://www.npmjs.com/package/react-dom).
NPM will not automatically install these for you but it will show you a warning message with instructions on how to install them.

Documentation
---------------

API documentation available [here](docs/README.md).

There are also a couple of how-to guides:
* [Customizing classes and styles](docs/customizingStyles.md)
* [Displaying items in reverse order](docs/reverseList.md)
* [Using AutoSizer](docs/usingAutoSizer.md)
* [Creating an infinite-loading list](docs/creatingAnInfiniteLoadingList.md)

Examples
---------------

Examples for each component can be seen in [the documentation](docs/README.md).

Here are some online demos of each component:

* [ArrowKeyStepper](https://bvaughn.github.io/react-virtualized/?component=ArrowKeyStepper)
* [AutoSizer](https://bvaughn.github.io/react-virtualized/?component=AutoSizer)
* [Collection](https://bvaughn.github.io/react-virtualized/?component=Collection)
* [ColumnSizer](https://bvaughn.github.io/react-virtualized/?component=ColumnSizer)
* [FlexTable](https://bvaughn.github.io/react-virtualized/?component=FlexTable)
* [Grid](https://bvaughn.github.io/react-virtualized/?component=Grid)
* [InfiniteLoader](https://bvaughn.github.io/react-virtualized/?component=InfiniteLoader)
* [ScrollSync](https://bvaughn.github.io/react-virtualized/?component=ScrollSync)
* [VirtualScroll](https://bvaughn.github.io/react-virtualized/?component=VirtualScroll)

And here are some "recipe" type demos:
* [Collapsable tree view](https://rawgit.com/bvaughn/react-virtualized/master/playground/tree.html)
* [Full-page grid (spreadsheet)](https://rawgit.com/bvaughn/react-virtualized/master/playground/grid.html)

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
