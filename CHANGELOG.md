Changelog
------------

##### 6.0.2
Added [transform-react-inline-elements](http://babeljs.io/docs/plugins/transform-react-inline-elements/) to UMD build for minor runtime performance improvements.
This change does not effect CommonJS or ES6 module builds because I did not want to remove prop-type checks.
You should apply this transformation step as part of your own production build pipeline.

##### 6.0.1
Removed lingering references to `react-pure-render` with with [`shallowCompare`](https://facebook.github.io/react/docs/shallow-compare.html).
This was meant to be part of the initial 6.0 release but was left out accidentally.

# 6.0.0

Version 6 includes the following changes.
(For more background information refer to the [Version 6 Roadmap wiki page](https://github.com/bvaughn/react-virtualized/wiki/Version-6-Roadmap).)
At a high-level the purpose of this release is to improve customization and flexibility with regard to arrow-key event handling.

### Backwards-incompatible changes
* Refactored `Grid` to remove arrow-key scroll-snapping. Instead this feature is implemented in a HOC, `ArrowKeyStepper`. The upgrade path from React 5.x to 6.x if you want to maintain arrow-key navigation behavior is as follows:

```js
// Before...
<Grid {...gridProps}/>

// After...
<ArrowKeyStepper
  columnsCount={columnsCount}
  rowsCount={rowsCount}
>
  {({ onSectionRendered, scrollToColumn, scrollToRow }) => (
    <Grid
      columnsCount={columnsCount}
      onSectionRendered={onSectionRendered}
      rowsCount={rowsCount}
      scrollToColumn={scrollToColumn}
      scrollToRow={scrollToRow}
      {...otherGridProps}
    />
  )}
</ArrowKeyStepper>
```
* The following public methods have also be removed from components:
  * `FlexTable`: `scrollToRow` (use `scrollToIndex` prop instead), `setScrollTop` (use `scrollTop` prop instead)
  * `Grid`: `scrollToCell` (use `scrollToColumn` and `scrollToRow` props instead), `setScrollPosition` (use `scrollLeft` and `scrollTop` props instead)
  * `VirtualScroll`: `scrollToRow` (use `scrollToIndex` prop instead), `setScrollTop` (use `scrollTop` prop instead)

### Backwards-compatible changes
* Replaced (the now unsupported) `react-pure-render` with [`shallowCompare`](https://facebook.github.io/react/docs/shallow-compare.html).

##### 5.5.6
Max scroll position logic in `Grid` now takes scrollbar size into consideration.
Also includes a small `render` optimization for null cells.
This release made possible by @jquense!

##### 5.5.5
Updated `package.json` to support React `^0.14.0` as well as `^15.0.0-rc.1`.
Thanks to @opichals for the PR.

##### 5.5.4
Changed key-down event handler in `VirtualScroll`, `FlexTable`, and `Grid` to no longer call `event.preventDefault()` for arrow-key events.
This was causing poor user interactions for `<input>` elements within `VirtualScroll` and `FlexTable` components.
Note that this issue still occurs for `<input>` elements in a `Grid` component.

This release also removes the `outline: 0` default style for `Grid`.
After consideration I think that's a harmful default behavior.

##### 5.5.3
Added `will-change` property to `Grid` to work around a Chrome bug(?) that caused the entire grid to be repainted whenever a new row or column was added. This was negatively impacting scrolling performance for Chrome under certain conditions. This change is not expected to impact Firefox, Safari, or IE.

Also trapped scroll events inside of `AutoSizer` so that `sdecima/javascript-detect-element-resize` did not treat them as potential resizes and unnecessarily force a sync DOM layout.

##### 5.5.2
Removed two unnecessary method calls in `Grid` and replaced them with cached properties. Should offer a minor performance boost.
Added better bounds-checking to util function `getVisibleCellIndices()`

##### 5.5.1
Removed unnecessary `setImmediate` in `Grid` initialization code.
This prevents a possible edge-case runtime error when a `Grid` is mounted and then removed before `setImmediate` is invoked.

### 5.5.0
`ScrollSync` passes additional parameters to child function in order to enable more complex scroll-driven UI changes.

### 5.4.0
Added optional `headerRenderer` property to `FlexColumn` to enable custom `FlexTable` header cells.

##### 5.3.2
Decoupled x/y axes in `Grid` when determining whether or not to enable overflow.
This results in more robustly handling issues like the one reported in PR #133.
It also comes with the small cost of partially obscuring a small part of cells (the area used by a scrollbar).

##### 5.3.1
Fixed edge-case where always-on scrollbars were not hidden once shown (see issue #116).

### 5.3.0
Separated CommonJS and UMD builds and pointed package.json's `main` target at the CommonJS build.
Also moved the ES6 modules build from `/es` to `/dist/es` to reduce the amount of clutter in the packaged dir.

##### 5.2.4
Changed `Grid` child `key` attributes again to reduce the number of elements created as a result of scrolling.
This dramatically improves perforamance without introducing any known regressions.
Thanks to @cesarandreu for consulting on this release.

##### 5.2.3
Reverted `transform: translate` positioning to old `top` / `left` positioning to address performance concerns reported via PR #124 and issue #94.

##### 5.2.2
Updated ES6 module build to be Rollup-friendly by way of `es2015-rollup` Babel preset.
Also cleaned up NPM package to suppress unnecessary files (via new `.npmignore`).

##### 5.2.1
Fixes long-standing slow wheel scrolling issue that affected certain browsers such as Firefox (see issue #2). Big thanks to James Long (@jlongster), Markus Stange ‏(@mstange), and Dan Abramov (@gaearon) ‏for their help with this fix.

### 5.2.0
Added optional `onResize` callback property to `AutoSizer`. This method is invoked any time the `AutoSizer` detects a resize. It is passed `width` and `height` named parameters.

Added optional `minWidth` and `maxWidth` properties to `FlexColumn` to enable greater flexibility with regard to table-column layout.

##### 5.1.1
Marked `FlexColumn` `width` property as required since ommitting this property can lead to uneven column layouts.

### 5.1.0
Added `ColumnSizer` high-order component for auto-calculating column widths for `Grid` cells.

#### 5.0.1

Added `webkit-transform` style to `Grid` cells for iOS 8 support.

# 5.0.0

Version 5 includes the following changes.
(For more background information refer to the [Version 5 Roadmap wiki page](https://github.com/bvaughn/react-virtualized/wiki/Version-5-Roadmap).)
At a high-level the purpose of this release is to make HOCs more easily composible in order to support a wider variety of them in the future.
A secondary goal was to cut redundant code from `VirtualScroll` and rely more heavily on the base `Grid` component.

###### Backwards-incompatible changes
* Refactored `FlexTable` and `VirtualScroll` to be HOCs that use `Grid` internally. This change makes `width` a required attribute for all virtualized components. A simple upgrade strategy is to use the `AutoSizer` HOC (learn more [here](docs/AutoSizer.md)).
* Changed globally exported library name (for use with vanilla `<script>` tags) to `window.ReactVirtualized` instead of `window["react-virtualized"]` (see [issue #86](https://github.com/bvaughn/react-virtualized/issues/86)).
* Removed `horizontalPadding` and `verticalPadding` properties from `FlexTable`. These properties were redundant. Such padding should be the responsibility of the parent container and taken into consideration by the injected `width` and `height`.
* Refactored `InfiniteLoader` and `AutoSizer` to require function children so as to be more easily composable with each other and new HOCs like `ScrollSync` (learn more [here](docs/usingAutoSizer.md#using-autosizer-with-infiniteloader)).
* `AutoSizer` no longer supports a `className` property or uses the global 'AutoSizer' class.

###### Backwards-compatible changes
* Added ES6 module and `jsnext:main` target to enable tree-shaking support.
* Updated `onScroll` property to specific total scrollable area so that offsets can be converted into percentages if desired (learn more [here](docs/README.md)).
* Replaced `top` / `left` cell positioning with `transform: translate()` for small performance gains. (This may become configurable in the future if any negative impact on performance is noticed.)
* Created `ScrollSync` HOC for synchronizing scrolling between two or more virtualized components (learn more [here](docs/ScrollSync.md)).

### 4.10.0
`FlexTable` and `VirtualScroll` get a new property, `overscanRowsCount`. `Grid` gets `overscanRowsCount` and `overscanColumnsCount`.
These properties can be used to reduce visual flicker around the sides of virtualized components when quickly scrolling.
`overscanRowsCount` defaults to 10 and `overscanColumnsCount` defaults to 0; adjust as necessary based on the size of your lists and cells.

`FlexTable` sets a default value of 0 for `headerHeight` to more gracefully support `disableHeader` use case.

### 4.9.0
`AutoSizer` component now takes padding into consideration before setting the `width` and `height` of its children.

##### 4.8.1
Updated `InfiniteLoader` to better reflect required properties. (`isRowLoaded`, `rowsCount`, and `threshold` were not marked as required before.)

### 4.8.0
Updated `InfiniteLoader` to support being composable within an `AutoSizer` HOC. If either a `width` or `height` attribute are specified on `InfiniteLoader` they will be bundled through to the loader's child component.

##### 4.7.1
Fixed `AutoSizer` bug that caused it to prevent parent flex containers from shrinking in some contexts.

### 4.7.0
Added `scrollToIndex` property to `FlexTable` to be passed through to inner `Grid`.

##### 4.6.6
Better gaurd against `NaN` values for `clientWidth` and `offsetWidth` for test environments using `jsdom`.

##### 4.6.5
Added `react-dom` to the Webpack :externals node to avoid including it in the build.
This fixes the bad `4.6.3` and `4.6.4` builds. Sorry!

##### 4.6.4
Moved `react-dom` from `dependencies` to `peerDependencies` to fix bad `4.6.3` build.

##### 4.6.3
Fixed edge-case sizing bug with `FlexTable` headers and always-on scrollbars (see issue #80 for more info).

##### 4.6.2
Replaced single occurence of `Number.isNaN` with `isNaN` to avoid IE compatibility issues. Maybe in the future I will add a polyfill dependency but I did not intend to introduce this without a major version bump so I'm removing it.

##### 4.6.1
Removes `event.stopPropagation` since it was unnecessary to prevent keyboard event bubbling, only to prevent the default browser behavior.

### 4.6.0
Relocated a couple of static style properties from inline style object to exported CSS file for easier customization.
Added `Grid__cell` and `VirtualScroll__row` classes.

### 4.5.0
Added `onScroll` callback to `Grid`, `FlexTable`, and `VirtualScroll`.
Added `scrollToCell` method to `Grid` and `scrollToRow` to `FlexTable`, and `VirtualScroll`.

##### 4.4.3
Added `-ms-flex` and `-webkit-flex` browser prefixes to `FlexTable` cells.

##### 4.4.2
Fixed invalid function reference in `Grid` triggered by specifying an initial `scrollToRow` property.

##### 4.4.1
Fixed distribution to include new `Grid` component as an export.

### 4.4.0
Added new `Grid` component for virtualizing rows _and_ columns .
Updated `AutoSizer` component to support managing _only_ `width` or `height` (in addition to both).

##### 4.3.1
Fixed small CSS property misnaming issue.

### 4.3.0
`FlexTable` now supports dynamic row-heights (in the same way as `VirtualScroll`).

##### 4.2.1
Set `VirtualScroll` default style to `width: 100%` to be more inline with default `FlexTable` behavior.

### 4.2.0
Replaced `React.cloneElement` with wrapper element in order to:
* Better support for pure function components; (they were not compatible with inline style positioning).
* Relax the requirement of `rowRenderer` having to specify a `key`.
* Support `React.PropTypes.node` children (including plain strings, numbers, etc.) instead of just elements.

### 4.1.0
Added `-webkit-overflow-scrolling: touch` for smoother inertial scrolling on mobile devices.

##### 4.0.2
Additional `columnData` parameter passed to `onHeaderClick` callback.

##### 4.0.1
Removed an unused dependency on 'inline-style-prefixer' from the `package.json`.

# 4.0.0
CSS styles have been split into their own, separately loaded stylesheet. This simplifies universal/isomorphic use cases without breaking vendor prefixing. This change means that you'll need to import the following additional file. This only needs to be done once (usually during bootstrapping).
```js
import 'react-virtualized/styles.css';
```

In this release the `width` property of the `FlexTable` component was removed. Tables will now grow to fill 100% of the width of their parent container.

The `AutoSizer`'s `ChildComponent` attribute has been removed in favor of using a regular react child. For example:
```html
<AutoSizer
  ChildComponent={VirtualScroll}
  {...props}
/>
```
Should instead be this:
```html
<AutoSizer>
  <VirtualScroll {...props}/>
</AutoSizer>
```

##### 3.1.1
New `onHeaderClick` property added to `FlexTable`. Thanks to @olslash for the contribution!

### 3.1.0
Added high-order `InfiniteLoader` component to manage just-in-time fetching of data as a user scrolls up or down in a list.
For more information about this component refer to the [API docs](https://github.com/bvaughn/react-virtualized/blob/master/docs/InfiniteLoader.md).

##### 3.0.1
Fixed small NPE when up/down arrow key was used while an empty VirtualScroll was in-focus.

# 3.0.0
CSS styles have been split into two groups: functional styles (eg. `position`, `overflow`) and presentational styles (eg. `text-transform`, `color`) and both have been converted to inline styles rather than being loaded as CSS. This was done primarily to simplify usage for universal/isomorphic rendering.

For more information on customizing styles refer to the [documentation](https://github.com/bvaughn/react-virtualized/#customizing-styles)...

### 2.8.0
Changed `Autosizer` component to support a single child instead of the `ChildComponent` property.
(For backwards compatibility purposes the `ChildComponent` property will continue to be supported.)

##### 2.7.5
Defer loading of element resize code until `componentDidMount` to avoid undefined `document` and `body` references.
This was breaking server-side rendering.

##### 2.7.4
Uglify dist build to remove dead code.

##### 2.7.2 & 2.7.3
Improved checks for undefined `document` and `window` in hopes of better supporting server-side rendering.

##### 2.7.1
Replaced invalid `rowHeight instanceof Number` check with `typeof rowHeight === 'number'` in `VirtualScroll`.

### 2.7.0
Moved `onRowsRendered` to `componentDidUpdate` (instead of `render`) to keep `render` free of side-effects.
Added tests to ensure that the callback is only invoked once per start/stop index pair (and not again unless the indices change).

##### 2.6.2
Added check for undefined `document` before accessing `attachEvent` to avoid causing problems with server-side rendering.

##### 2.6.1
Cell `title` now only set if rendered cell contents are a string. This fixes issue #35.

### 2.6.0
`VirtualScroll` and `FlexTable` now support dynamic row heights by accepting a function as the `rowHeight` property.

### 2.5.0
Added `AutoSizer` component for wrapping `FlexTable` or `VirtualScroll` and growing to fill the parent container. This should hopefully simplify usage of these components.

### 2.4.0
`FlexTable` and `VirtualScroll` offer new callback property `onRowsRendered` to be invoked with a params object `{ startIndex, stopIndex }` after rows have been rendered.

### 2.3.0
`FlexTable`'s `rowClassName` property can now be either a string or a function in order to support dynamic row classes (eg. alternating colors).

### 2.2.0
Added `onRowClick` property to `FlexTable`.

##### 2.1.1
Fixed a few minor FlexTable font styles to use relative sizes instead of custom ones

### 2.1.0
Added optional `noRowsRenderer` property to `VirtualScroll` and `FlexTable`.
This property can be used to render loading indicators or placeholder content for empty lists.

# 2.0.0
Set `shouldPureComponentUpdate` on component prototypes instead of instances.
Dropped half-ass support for React 0.13. This module has always depended on React 0.14 but it was checking in previous versions and trying to be backwards compatible with 0.13. Since that check is no longer in place, this is a major version bump (even though there is no real new functionality being added).

##### 1.0.4
Fixed package.json dependencies by moving `classnames`, `raf`, and `react-pure-render` out of `peerDependencies` and into `dependencies`.

##### 1.0.3
Same as version 1.0.2; published just to update NPM keyword and description.

##### 1.0.2
Removed default row-border styling from FlexTable and added new :rowClassName property.

##### 1.0.1
Updated to use ReactDOM.findDOMNode instead of getDOMNode (but added backwards-compatible check for < React v0.14).

# 1.0.0
Package JSON updated so that "main" entry points to `dist/react-virtualized.js` to provide easier integration for users that don't want Babel/Webpack to have to process their `node_modules` folder.

##### 0.0.4
Added keypress scrolling support.

##### 0.0.3
Added "main" entry to package.json.

##### 0.0.2
Added CSS auto-prefixing to support Safari and other, older browsers.

##### 0.0.1
Initial release.
