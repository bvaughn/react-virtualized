## Creating an Infinite-Loading List

The `InfiniteLoader` component was created to help break large data sets down into chunks that could be just-in-time loaded as they were scrolled into view.
It can also be used to create an infinite-loading list (eg. Twitter or Facebook).
Here's a basic example of how you might implement that:

```jsx
function MyComponent({
  /** Are there more items to load? (This information comes from the most recent API request.) */
  hasNextPage,
  /** Are we currently loading a page of items? (This may be an in-flight flag in your Redux store for example.) */
  isNextPageLoading,
  /** List of items loaded so far */
  list,
  /** Callback function (eg. Redux action-creator) responsible for loading the next page of items */
  loadNextPage,
}) {
  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  const rowCount = hasNextPage ? list.size + 1 : list.size;

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreRows = isNextPageLoading ? () => {} : loadNextPage;

  // Every row is loaded except for our loading indicator row.
  const isRowLoaded = ({index}) => !hasNextPage || index < list.size;

  // Render a list item or a loading indicator.
  const rowRenderer = ({index, key, style}) => {
    let content;

    if (!isRowLoaded({index})) {
      content = 'Loading...';
    } else {
      content = list.getIn([index, 'name']);
    }

    return (
      <div key={key} style={style}>
        {content}
      </div>
    );
  };

  return (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={loadMoreRows}
      rowCount={rowCount}>
      {({onRowsRendered, registerChild}) => (
        <List
          ref={registerChild}
          onRowsRendered={onRowsRendered}
          rowRenderer={rowRenderer}
          {...otherProps}
        />
      )}
    </InfiniteLoader>
  );
}
```
