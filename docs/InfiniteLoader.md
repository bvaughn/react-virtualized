## InfiniteLoader

A component that manages just-in-time fetching of data as a user scrolls up or down in a list.

Note that this component is intended to assist with row-loading.
As such it is best suited for use with `Table` and `List` (although it can also be used with `Grid`).
This component is not compatible with the `Collection` component.

This is an advanced component and can be confusing in certain situations.
[See below for more information](#edge-cases-and-considerations).

### Prop Types

| Property         | Type     | Required? | Description                                                                                                                                                                                                                                                                                                                                                                                               |
| :--------------- | :------- | :-------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| children         | Function |     ✓     | Function responsible for rendering a virtualized component. This function should implement the following signature: `({ onRowsRendered: Function, registerChild: Function }) => PropTypes.element`                                                                                                                                                                                                        |
| isRowLoaded      | Function |     ✓     | Function responsible for tracking the loaded state of each row. It should implement the following signature: `({ index: number }): boolean`                                                                                                                                                                                                                                                               |
| loadMoreRows     | Function |     ✓     | Callback to be invoked when more rows must be loaded. It should implement the following signature: `({ startIndex: number, stopIndex: number }): Promise`. The returned Promise should be resolved once row data has finished loading. It will be used to determine when to refresh the list with the newly-loaded data. This callback may be called multiple times in reaction to a single scroll event. |
| minimumBatchSize | Number   |           | Minimum number of rows to be loaded at a time. This property can be used to batch requests to reduce HTTP requests. Defaults to `10`.                                                                                                                                                                                                                                                                     |
| rowCount         | Number   |     ✓     | Number of rows in list; can be arbitrary high number if actual number is unknown.                                                                                                                                                                                                                                                                                                                         |
| threshold        | Number   |           | Threshold at which to pre-fetch data. A threshold X means that data will start loading when a user scrolls within X rows. Defaults to `15`.                                                                                                                                                                                                                                                               |

### Public Methods

##### resetLoadMoreRowsCache (autoReload: boolean = false)

Reset any cached data about already-loaded rows. This method should be called if any/all loaded data needs to be refetched (eg a filtered list where the search criteria changes). If `autoReload` passed as true, the last loaded batch would be automatically reloaded.

### Children function

The child function is passed the following named parameters:

| Parameter      | Type     | Description                                                                                                                               |
| :------------- | :------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| onRowsRendered | Function | This function should be passed as the child's `onRowsRendered` property. It informs the loader when the user is scrolling.                |
| registerChild  | Function | This function should be set as the child's `ref` property. It enables a set of rows to be refreshed once their data has finished loading. |

### Examples

###### InfiniteLoader and List

This example uses `InfiniteLoader` to prefetch rows in a `List` list as a user scrolls.
An interactive demo can be seen [here](https://bvaughn.github.io/react-virtualized/#/components/InfiniteLoader).

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { InfiniteLoader, List } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

// This example assumes you have a way to know/load this information
const remoteRowCount

const list = [];

function isRowLoaded ({ index }) {
  return !!list[index];
}

function loadMoreRows ({ startIndex, stopIndex }) {
  return fetch(`path/to/api?startIndex=${startIndex}&stopIndex=${stopIndex}`)
    .then(response => {
      // Store response data in list...
    })
}

function rowRenderer ({ key, index, style}) {
  return (
    <div
      key={key}
      style={style}
    >
      {list[index]}
    </div>
  )
}

// Render your list
ReactDOM.render(
  <InfiniteLoader
    isRowLoaded={isRowLoaded}
    loadMoreRows={loadMoreRows}
    rowCount={remoteRowCount}
  >
    {({ onRowsRendered, registerChild }) => (
      <List
        height={200}
        onRowsRendered={onRowsRendered}
        ref={registerChild}
        rowCount={remoteRowCount}
        rowHeight={20}
        rowRenderer={rowRenderer}
        width={300}
      />
    )}
  </InfiniteLoader>,
  document.getElementById('example')
);
```

###### InfiniteLoader and Grid

It is not common to use `InfiniteLoader` and `Grid` together but it is possible using an approach like this:

```jsx
class MyComponent extends Component {
  constructor (props, context) {
    super(props, context)

    this._infiniteLoaderChildFunction = this._infiniteLoaderChildFunction.bind(this)
    this._onSectionRendered = this._onSectionRendered.bind(this)
  }

  render () {
    const { infiniteLoaderProps } = this.props

    <InfiniteLoader {...infiniteLoaderProps}>
      {this._infiniteLoaderChildFunction}
    </InfiniteLoader>
  }

  _infiniteLoaderChildFunction ({ onRowsRendered, registerChild }) {
    this._onRowsRendered = onRowsRendered

    const { gridProps } = this.props

    return (
      <Grid
        {...gridProps}
        onSectionRendered={this._onSectionRendered}
        ref={registerChild}
      />
    )
  }

  _onSectionRendered ({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex }) {
    const startIndex = rowStartIndex * columnCount + columnStartIndex
    const stopIndex = rowStopIndex * columnCount + columnStopIndex

    this._onRowsRendered({
      startIndex,
      stopIndex
    })
  }
}
```

### Edge Cases and Considerations

###### Tracking loaded (and loading) rows

`InfiniteLoader` is not a stateful component, meaning that it does not keep track of which rows it has requested to be loaded.
Your component will need to track this information yourself to avoid loading rows multiple times.
One way to do this is to to use a map to track the status of each row like so:

```js
_isRowLoaded ({ index }) {
  const { loadedRowsMap } = this.state

  // No entry in this map signifies that the row has never been loaded before
  // An entry (either LOADING or LOADED) can be treated as loaded as far as InfiniteLoader is concerned
  return !!loadedRowsMap[index]
}
```

###### Memoization and rowCount changes

`InfiniteLoader` memoizes calls to `loadMoreRows` in order to avoid multiple calls with the same parameters while a user is scrolling.
This can have an unexpected impact though if the underlying collection data changes.
In that case it is possible that `InfiniteLoader` will not _know_ to call `loadMoreRows` again because- from its point of view- it already made that call for a given row.
(React Virtualized components do not know anything about the underlying data after all, only the number of items in the collection.)

The easiest way to address this is for your application code to call `loadMoreRows` when it detects that the underlying collection may have changed.
For example:

```js
_loadMoreRows ({ startIndex, stopIndex }) {
  this._loadMoreRowsStartIndex = startIndex
  this._loadMoreRowsStopIndex = stopIndex

  // Load the rows
}

componentDidUpdate (prevProps, prevState) {
  // If props/state signals that the underlying collection has changed,
  // Reload the most recently requested batch of rows:
  if (...) {
    this._loadMoreRows({
      startIndex: this._loadMoreRowsStartIndex,
      stopIndex: this._loadMoreRowsStopIndex
    })
  }
}
```
