## Using AutoSizer

The `AutoSizer` component decorates a React element and automatically manages `width` and `height` properties so that decorated element fills the available space. This simplifies usage of components like `Grid`, `Table`, and `List` that require explicit dimensions.

This guide covers a few of the most commonly asked questions about using the component.

### Observation

This component uses [`javascript-detect-element-resize`](https://github.com/sdecima/javascript-detect-element-resize) algorithm, and it does a little direct DOM manipulation to its parent, outside React's VirtualDOM.

If the parent has style `position: static` (default value), it changes to `position: relative`. It also injects a sibling `div` for size measuring.

#### `AutoSizer` component is not displaying (`AutoSizer` height is 0)?

`AutoSizer` expands to _fill_ its parent but it will not _stretch_ the parent.
This is done to prevent problems with flexbox layouts.

**If `AutoSizer` is reporting a height (or width) of 0 - then it's likely that the parent element (or one of its parents) has a height of 0. ⚠️** One easy way to test this is to add a style property (eg `background-color: red;`) to the parent to ensure that it is the correct size.

#### How to fix `AutoSizer` setting a height of 0?

If you are using `AutoSizer` within a flexbox layout, you may need to do a few things:

1. Add `height: 100%;` style property to all of the `AutoSizer` _ancestor_ elements, not just the parent, eg `html, body, #root, .app, .logs { height: 100%; }`. For the `AutoSizer` _parent_ element you can add `flex: 1` instead (they both work).

2. You may need to also add `box-sizing: border-box;` to all the elements eg `* { box-sizing: border-box; }`.

```jsx
<div
  style={{
    display: 'flex',
    flexDirection: 'column',
    height: '100%', // AutoSizer's ancestor element: add the height of 100%.
  }}>
  /* Add children components here. For the AutoSizer parent add `height: 100%`
  or `flex: 1`. They both work. */
  <div style={{height: '100%'}}>
    <AutoSizer>
      {({height, width}) => (
        <List
          className="List"
          height={height}
          itemCount={1000}
          itemSize={35}
          width={width}>
          {Row}
        </List>
      )}
    </AutoSizer>
  </div>
</div>
```

#### Can I use AutoSizer to manage only width or height (not both)?

You can use `AutoSizer` to control only one dimension of its child component using the `disableHeight` or `disableWidth` attributes. For example, a fixed-height component that should grow to fill the available width can be created like so:

```jsx
<AutoSizer disableHeight>
  {({width}) => <Component height={200} width={width} {...props} />}
</AutoSizer>
```

#### Can I use AutoSizer within a flex container?

When using an `AutoSizer` as a direct child of a flex box it usually works out best to wrap it with a div, like so:

```jsx
<div style={{ display: 'flex' }}>
  <!-- Other children... -->
  <div style={{ flex: '1 1 auto' }}>
    <AutoSizer>
      {({ height, width }) => (
        <Component
          width={width}
          height={height}
          {...props}
        />
      )}
    </AutoSizer>
  </div>
</div>
```

#### Can I use AutoSizer with other HOCs like InfiniteLoader?

`AutoSizer` can be used within other react-virtualized HOCs such as `InfiniteLoader` or `ScrollSync` like so:

```jsx
<InfiniteLoader {...infiniteLoaderProps}>
  {({onRowsRendered, registerChild}) => (
    <AutoSizer>
      {({height, width}) => (
        <List
          ref={registerChild}
          width={width}
          height={height}
          onRowsRendered={onRowsRendered}
          {...listProps}
        />
      )}
    </AutoSizer>
  )}
</InfiniteLoader>
```

You can see an example of this [here](https://bvaughn.github.io/react-virtualized/#/components/InfiniteLoader).

### Applying Content Security Policy

[The specification of Content Security Policy](https://www.w3.org/TR/2016/REC-CSP2-20161215/#intro)
describes as the following:

> This document defines Content Security Policy, a mechanism web applications
> can use to mitigate a broad class of content injection vulnerabilities, such
> as cross-site scripting (XSS).

To apply Content Security Policy, pass a `nonce` to _react-virtualized_ and add a matching `nonce-source` to the `Content-Security-Policy` field in HTTP header.
