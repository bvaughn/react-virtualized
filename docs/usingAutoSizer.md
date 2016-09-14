Using AutoSizer
---------------

The `AutoSizer` component decorates a React element and automatically manages `width` and `height` properties so that decorated element fills the available space. This simplifies usage of components like `Grid`, `FlexTable`, and `List` that require explicit dimensions.

This guide covers a few of the most commonly asked questions about using the component.

#### Using AutoSizer to manage only width (or height)
You can use `AutoSizer` to control only one dimension of its child component using the `disableHeight` or `disableWidth` attributes. For example, a fixed-height component that should grow to fill the available width can be created like so:

```html
<AutoSizer disableHeight>
  {({ width }) => (
    <Component
      height={200}
      width={width}
      {...props}
    />
  )}
</AutoSizer>
```

#### Using AutoSizer within a flex container
When using an `AutoSizer` as a direct child of a flex box it usually works out best to wrap it with a div, like so:

```html
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

#### Using AutoSizer with InfiniteLoader
`AutoSizer` can be used within other react-virtualized HOCs such as `InfiniteLoader` or `ScrollSync` like so:

```html
<InfiniteLoader {...infiniteLoaderProps}>
  {({ onRowsRendered, registerChild }) => (
    <AutoSizer>
      {({ height, width }) => (
        <List
          ref={registerChild}
          width={width}
          height={height}
          onRowsRendered={onRowsRendered}
          {...virtualScrollProps}
        />
      )}
    </AutoSizer>
  )}
</InfiniteLoader>
```

You can see an example of just such a thing [here](https://bvaughn.github.io/react-virtualized/?component=InfiniteLoader).
