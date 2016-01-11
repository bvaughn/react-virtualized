InfiniteLoader
---------------

High-order component that manages just-in-time fetching of data as a user scrolls up or down in a list.

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| isRowLoaded | Function | ✓ | Function responsible for tracking the loaded state of each row. It should implement the following signature: `(index: number): boolean` |
| loadMoreRows | Function | ✓ | Callback to be invoked when more rows must be loaded. It should implement the following signature: `({ startIndex, stopIndex }): Promise`. The returned Promise should be resolved once row data has finished loading. It will be used to determine when to refresh the list with the newly-loaded data. This callback may be called multiple times in reaction to a single scroll event. |
| rowsCount | Number | ✓ | Number of rows in list; can be arbitrary high number if actual number is unknown. |
| threshold | Number |  | Threshold at which to pre-fetch data. A threshold X means that data will start loading when a user scrolls within X rows. This value defaults to 15. |
