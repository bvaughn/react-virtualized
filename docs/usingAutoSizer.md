Using AutoSizer
---------------

The `AutoSizer` component decorates a React element and automatically manages `width` and `height` properties so that decorated element fills the available space. This simplifies usage of components like `Grid`, `FlexTable`, and `VirtualScroll` that require explicit dimensions.

This guide covers a few of the most commnonly asked questions about using the component.

#### Using AutoSizer to manage only width (or height)
You can use `AutoSizer` to control only one dimension of its child component using the `disableHeight` or `disableWidth` attributes. For example, a fixed-height component that should grow to fill the available width can be created like so:

```html
<AutoSizer disableHeight>
  <Component
    height={200}
    {...props}
  />
</AutoSizer>
```

#### Using AutoSizer within a flex container
When using an `AutoSizer` as a direct child of a flex box it usually works out best to wrap it with a div, like so:

```html
<div style={{ display: 'flex' }}>
  <!-- Other children... -->
  <div style={{ flex: '1 1 auto' }}>
    <AutoSizer>
      <Component {...props} />
    </AutoSizer>
  </div>
</ContentBox>
```

#### Using AutoSizer with InfiniteScroller
One of the main goals of the version 5 release is to enable react-virtualized HOCs to be nested in any order. However at the current time, using an `AutoSizer` with an `InfiniteLoader` should be done like this:

```html
<AutoSizer>
  <InfiniteLoader {...props}>
    <VirtualScroll {...props}/>
  </InfiniteLoader>
</AutoSizer>
```

You can see an example of just such a thing [here](https://bvaughn.github.io/react-virtualized/?component=InfiniteLoader).
