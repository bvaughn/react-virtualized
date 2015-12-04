Changelog
------------

#### 2.0.0
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

#### 1.0.0
Package JSON updated so that "main" entry points to `dist/react-virtualized.js` to provide easier integration for users that don't want Babel/Webpack to have to process their `node_modules` folder.

#### 0.0.4
Added keypress scrolling support.

#### 0.0.3
Added "main" entry to package.json.

#### 0.0.2
Added CSS auto-prefixing to support Safari and other, older browsers.

#### 0.0.1
Initial release.
