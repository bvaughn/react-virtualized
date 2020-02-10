The `Masonry` component efficiently displays dynamically-sized, user-positioned cells using windowing techniques. Cell positions are controlled by an injected `cellPositioner` property. Windowing is vertical; this component does not support horizontal scrolling.

### Overview

#### Measuring and layout

Rendering occurs in two phases:

##### Phase 1: Measurement

This phase uses estimated cell sizes (provided by the `cellMeasurerCache` property) to determine how many cells to measure in a batch. Batch size is chosen using a fast, naive layout algorithm that stacks images in order until the viewport has been filled. After measurement is complete (`componentDidMount` or `componentDidUpdate`) this component evaluates positioned cells in order to determine if another measurement pass is required (eg if actual cell sizes were less than estimated sizes). All measurements are permanently cached (keyed by `keyMapper`) for performance purposes.

##### Phase 2: Layout

This phase uses the external `cellPositioner` to position cells. At this time the positioner has access to cached size measurements for all cells. The positions it returns are cached by `Masonry` for fast access later.

Phase one is repeated if the user scrolls beyond the current layout's bounds. If the layout is invalidated due to eg a resize, cached positions can be cleared using `recomputeCellPositions()` or `clearCellPositions()`.

#### Animation Constraints

- Simple animations are supported (eg translate/slide into place on initial reveal).
- More complex animations are not (eg flying from one position to another on resize).

#### Layout Constraints

- This component supports a multi-column layout.
- Each item can have a unique, lazily-measured height.
- The width of all items in a column must be equal. (Items may not span multiple columns.)
- The left position of all items within a column must align.
- Cell measurements must be synchronous. Size impacts layout and async measurements would require frequent layout invalidation. Support for this may be added in the future but for now the use of the `CellMeasurer` render callback's async `measure` parameter is not supported.

### Prop Types

| Property                   | Type     | Required? | Description                                                                                                                                                                                                  |
| :------------------------- | :------- | :-------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cellCount                  | number   |     ✓     | Total number of items                                                                                                                                                                                        |
| cellMeasurerCache          | mixed    |     ✓     | Caches item measurements. Default sizes help `Masonry` decide how many images to batch-measure. Learn more [here](CellMeasurer.md#cellmeasurercache).                                                        |
| cellPositioner             | function |     ✓     | Positions a cell given an index: `(index: number) => ({ left: number, top: number })`. [Learn more](#createmasonrycellpositioner)                                                                            |
| cellRenderer               | function |     ✓     | Responsible for rendering a cell given an index. [Learn more](#cellrenderer)                                                                                                                                 |
| className                  | string   |           | Optional custom CSS class name to attach to root `Masonry` element.                                                                                                                                          |
| height                     | number   |     ✓     | Height of the component; this value determines the number of visible items.                                                                                                                                  |
| id                         | string   |           | Optional custom id to attach to root `Masonry` element.                                                                                                                                                      |
| keyMapper                  | function |           | Maps an index to a unique id to store cached measurement and position info for a cell. This prevents eg cached measurements from being invalidated when a collection is re-ordered. `(index: number) => any` |
| onCellsRendered            | function |           | Callback invoked with information about the cells that were most recently rendered. This callback is only invoked when visible cells have changed: `({ startIndex: number, stopIndex: number }): void`       |
| onScroll                   | function |           | Callback invoked whenever the scroll offset changes within the inner scrollable region: `({ clientHeight: number, scrollHeight: number, scrollTop: number }): void`                                          |
| overscanByPixels           | number   |           | Render this many additional pixels above and below the viewport. This helps reduce flicker when a user scrolls quickly. Defaults to 20.                                                                      |
| role                       | string   |           | Optional override of ARIA role default; defaults to "grid".                                                                                                                                                  |
| scrollingResetTimeInterval | number   |           | Wait this amount of time after the last scroll event before resetting `pointer-events`; defaults to 150ms.                                                                                                   |
| style                      | mixed    |           | Optional custom inline style to attach to root `Masonry` element.                                                                                                                                            |
| tabIndex                   | number   |           | Optional override of tab index default; defaults to 0.                                                                                                                                                       |
| width                      | number   |     ✓     | Width of the component; this value determines the number of visible items.                                                                                                                                   |
| rowDirection               | string   |           | row direction of items, can be `ltr` or `rtl` defaults to `ltr`                                                                                                                                              |
| scrollTop                  | number   |           | Forced vertical scroll offset; can be used to synchronize scrolling between components                                                                                                                       |

## Public Methods

##### clearCellPositions ()

Clears internal position cache and force-updates.

##### recomputeCellPositions ()

Resets internal position cache, synchronously re-computes positions, then force-updates.

### cellRenderer

Responsible for rendering a single cell given its index. This function accepts the following named parameters:

```jsx
function cellRenderer({
  index, // Index of item within the collection
  isScrolling, // The Grid is currently being scrolled
  key, // Unique key within array of cells
  parent, // Reference to the parent Grid (instance)
  style, // Style object to be applied to cell (to position it);
  // This must be passed through to the rendered cell element.
}) {
  return (
    <CellMeasurer
      cache={cellMeasurerCache}
      index={index}
      key={key}
      parent={parent}>
      <div style={style}>{/* Your content goes here */}</div>
    </CellMeasurer>
  );
}
```

### createMasonryCellPositioner

`Masonry` provides a built-in positioner for a simple layout. This positioner requires a few configuration settings:

| Property          | Type                | Required? | Description                                  |
| :---------------- | :------------------ | :-------: | :------------------------------------------- |
| cellMeasurerCache | `CellMeasurerCache` |     ✓     | Contains cell measurements (eg item height). |
| columnCount       | number              |     ✓     | Number of columns to use in layout.          |
| columnWidth       | number              |     ✓     | Column width.                                |
| spacer            | number              |           | Empty space between columns; defaults to 0.  |

You can use this layout as shown below:

```js
const cellPositioner = createMasonryCellPositioner({
  cellMeasurerCache: cache,
  columnCount: 3,
  columnWidth: 200,
  spacer: 10,
});

let masonryRef;

function renderMasonry(props) {
  return (
    <Masonry
      cellMeasurerCache={cache}
      cellPositioner={cellPositioner}
      ref={ref => (masonryRef = ref)}
      {...props}
    />
  );
}
```

If any of the configuration settings change due to external changes (eg window resize event) you can update them using the `reset` method as shown below:

```js
cellPositioner.reset({
  columnCount: 4,
  columnWidth: 250,
  spacer: 15,
});

masonryRef.recomputeCellPositions();
```

### Basic `Masonry` Example

Below is a very basic `Masonry` example with a naive layout algorithm.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry,
} from 'react-virtualized';

// Array of images with captions
const list = [];

// Default sizes help Masonry decide how many images to batch-measure
const cache = new CellMeasurerCache({
  defaultHeight: 250,
  defaultWidth: 200,
  fixedWidth: true,
});

// Our masonry layout will use 3 columns with a 10px gutter between
const cellPositioner = createMasonryCellPositioner({
  cellMeasurerCache: cache,
  columnCount: 3,
  columnWidth: 200,
  spacer: 10,
});

function cellRenderer({index, key, parent, style}) {
  const datum = list[index];

  return (
    <CellMeasurer cache={cache} index={index} key={key} parent={parent}>
      <div style={style}>
        <img
          src={datum.source}
          style={{
            height: datum.imageHeight,
            width: datum.imageWidth,
          }}
        />
        <h4>{datum.caption}</h4>
      </div>
    </CellMeasurer>
  );
}

// Render your grid
ReactDOM.render(
  <Masonry
    cellCount={list.length}
    cellMeasurerCache={cache}
    cellPositioner={cellPositioner}
    cellRenderer={cellRenderer}
    height={600}
    width={800}
  />,
  document.getElementById('example'),
);
```

### Masonry example with dynamically measured images

Items in the list in basic example can only be measured once, which means client has to know all the
sizes upfront before displaying. For cases when server cannot deliver such data we need to
pre-measure images. In order to preserve correct optimized layout images can only be displayed one
by one in the order they appear in the array, not in the order they are loaded.

These specifics were taken into account in a small library
[react-virtualized-image-measurer](https://github.com/kirill-konshin/react-virtualized-image-measurer)
here is an example with dynamically measured images:

```js
import React from 'react';
import {render} from 'react-dom';
import {
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry,
} from 'react-virtualized';
import ImageMeasurer from 'react-virtualized-image-measurer';

// Array of images with captions
//const list = [{image: 'http://...', title: 'Foo'}];

// We need to make sure images are loaded from scratch every time for this demo
const noCacheList = list.map(item => ({
  ...item,
  image: item.image + '?noCache=' + Math.random(),
}));

const columnWidth = 200;
const defaultHeight = 250;
const defaultWidth = columnWidth;

// Default sizes help Masonry decide how many images to batch-measure
const cache = new CellMeasurerCache({
  defaultHeight,
  defaultWidth,
  fixedWidth: true,
});

// Our masonry layout will use 3 columns with a 10px gutter between
const cellPositioner = createMasonryCellPositioner({
  cellMeasurerCache: cache,
  columnCount: 3,
  columnWidth,
  spacer: 10,
});

const MasonryComponent = ({itemsWithSizes}) => {
  function cellRenderer({index, key, parent, style}) {
    const {item, size} = itemsWithSizes[index];
    const height = columnWidth * (size.height / size.width) || defaultHeight;

    return (
      <CellMeasurer cache={cache} index={index} key={key} parent={parent}>
        <div style={style}>
          <img
            src={item.image}
            alt={item.title}
            style={{
              height: height,
              width: columnWidth,
            }}
          />
          <h4>{item.title}</h4>
        </div>
      </CellMeasurer>
    );
  }

  return (
    <Masonry
      cellCount={itemsWithSizes.length}
      cellMeasurerCache={cache}
      cellPositioner={cellPositioner}
      cellRenderer={cellRenderer}
      height={600}
      width={800}
    />
  );
};

// Render your grid
render(
  <ImageMeasurer
    items={noCacheList}
    image={item => item.image}
    defaultHeight={defaultHeight}
    defaultWidth={defaultWidth}>
    {({itemsWithSizes}) => <MasonryComponent itemsWithSizes={itemsWithSizes} />}
  </ImageMeasurer>,
  document.getElementById('root'),
);
```

Live demo: https://codesandbox.io/s/7y66p25qv6
