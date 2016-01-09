Changelog
------------

#### 2.9.0
CSS styles have been split into two groups: functional styles (eg. `position`, `overflow`) and presentational styles (eg. `text-transform`, `color`) and both have been converted to inline styles rather than being loaded as CSS. This was done primarily to simplify usage for universal/isomorphic rendering.

For more information on customizing styles refer to the [documentation](https://github.com/bvaughn/react-virtualized/#customizing-styles)...

#### 2.8.0
Changed `Autosizer` component to support a single child instead of the `ChildComponent` property.
(For backwards compatibility purposes the `ChildComponent` property will continue to be supported.)

#### 2.7.5
Defer loading of element resize code until `componentDidMount` to avoid undefined `document` and `body` references.
This was breaking server-side rendering.

#### 2.7.4
Uglify dist build to remove dead code.

#### 2.7.2 & 2.7.3
Improved checks for undefined `document` and `window` in hopes of better supporting server-side rendering.

#### 2.7.1
Replaced invalid `rowHeight instanceof Number` check with `typeof rowHeight === 'number'` in `VirtualScroll`.

#### 2.7.0
Moved `onRowsRendered` to `componentDidUpdate` (instead of `render`) to keep `render` free of side-effects.
Added tests to ensure that the callback is only invoked once per start/stop index pair (and not again unless the indices change).

#### 2.6.2
Added check for undefined `document` before accessing `attachEvent` to avoid causing problems with server-side rendering.

#### 2.6.1
Cell `title` now only set if rendered cell contents are a string. This fixes issue #35.

#### 2.6.0
`VirtualScroll` and `FlexTable` now support dynamic row heights by accepting a function as the `rowHeight` property.

#### 2.5.0
Added `AutoSizer` component for wrapping `FlexTable` or `VirtualScroll` and growing to fill the parent container. This should hopefully simplify usage of these components.

#### 2.4.0
`FlexTable` and `VirtualScroll` offer new callback property `onRowsRendered` to be invoked with a params object `{ startIndex, stopIndex }` after rows have been rendered.

#### 2.3.0
`FlexTable`'s `rowClassName` property can now be either a string or a function in order to support dynamic row classes (eg. alternating colors).

#### 2.2.0
Added `onRowClick` property to `FlexTable`.

#### 2.1.1
Fixed a few minor FlexTable font styles to use relative sizes instead of custom ones

#### 2.1.0
Added optional `noRowsRenderer` property to `VirtualScroll` and `FlexTable`.
This property can be used to render loading indicators or placeholder content for empty lists.

## 2.0.0
Set `shouldPureComponentUpdate` on component prototypes instead of instances.
Dropped half-ass support for React 0.13. This module has always depended on React 0.14 but it was checking in previous versions and trying to be backwards compatible with 0.13. Since that check is no longer in place, this is a major version bump (even though there is no real new functionality being added).

#### 1.0.4
Fixed package.json dependencies by moving `classnames`, `raf`, and `react-pure-render` out of `peerDependencies` and into `dependencies`.

#### 1.0.3
Same as version 1.0.2; published just to update NPM keyword and description.

#### 1.0.2
Removed default row-border styling from FlexTable and added new :rowClassName property.

#### 1.0.1
Updated to use ReactDOM.findDOMNode instead of getDOMNode (but added backwards-compatible check for < React v0.14).

## 1.0.0
Package JSON updated so that "main" entry points to `dist/react-virtualized.js` to provide easier integration for users that don't want Babel/Webpack to have to process their `node_modules` folder.

#### 0.0.4
Added keypress scrolling support.

#### 0.0.3
Added "main" entry to package.json.

#### 0.0.2
Added CSS auto-prefixing to support Safari and other, older browsers.

#### 0.0.1
Initial release.
