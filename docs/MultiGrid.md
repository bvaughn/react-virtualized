## MultiGrid

Decorates `Grid` and adds fixed columns and/or rows.
This is already possible using `ScrollSync` and 2 or more `Grid`s but `MultiGrid` reduces the boilerplate.

The majority of `MultiGrid` properties (eg `cellRenderer`) are relayed to all child `Grid`s.
Some properties (eg `columnCount`, `rowCount`) are adjusted slightly to supported fixed rows and columns.

### Prop Types

| Property                    | Type     | Required? | Description                                                                                                                                                               |
| :-------------------------- | :------- | :-------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| classNameBottomLeftGrid     | string   |           | Optional custom className to attach to bottom-left `Grid` element.                                                                                                        |
| classNameBottomRightGrid    | string   |           | Optional custom className to attach to bottom-right `Grid` element.                                                                                                       |
| classNameTopLeftGrid        | string   |           | Optional custom className to attach to top-left `Grid` element.                                                                                                           |
| classNameTopRightGrid       | string   |           | Optional custom className to attach to top-right `Grid` element.                                                                                                          |
| enableFixedColumnScroll     | boolean  |           | Fixed column can be actively scrolled; disabled by default                                                                                                                |
| enableFixedRowScroll        | boolean  |           | Fixed row can be actively scrolled; disabled by default                                                                                                                   |
| fixedColumnCount            | number   |           | Number of fixed columns; defaults to `0`                                                                                                                                  |
| fixedRowCount               | number   |           | Number of fixed rows; defaults to `0`                                                                                                                                     |
| onScrollbarPresenceChange   | Function |           | Called whenever a horizontal or vertical scrollbar is added or removed from the bottom, right `Grid`.: `({ horizontal: boolean, size: number, vertical: boolean }): void` |
| style                       | object   |           | Optional custom inline style to attach to root `MultiGrid` element.                                                                                                       |
| styleBottomLeftGrid         | object   |           | Optional custom inline style to attach to bottom-left `Grid` element.                                                                                                     |
| styleBottomRightGrid        | object   |           | Optional custom inline style to attach to bottom-right `Grid` element.                                                                                                    |
| styleTopLeftGrid            | object   |           | Optional custom inline style to attach to top-left `Grid` element.                                                                                                        |
| styleTopRightGrid           | object   |           | Optional custom inline style to attach to top-right `Grid` element.                                                                                                       |
| hideTopRightGridScrollbar   | boolean  |           | Optional hides top-right `Grid` scrollbar by adding an additional wrapper. Only useful if `enableFixedRowScroll` is set to `true`                                         |
| hideBottomLeftGridScrollbar | boolean  |           | Optional hides bottom-left `Grid` scrollbar by adding an additional wrapper. Only useful if `enableFixedColumnScroll` is set to `true`                                    |

### Public Methods

##### forceUpdateGrids

Pass-thru that calls `forceUpdate` on all child `Grid`s.

##### measureAllCells

Pass-thru that calls `measureAllCells` on all child `Grid`s.

##### recomputeGridSize

Pass-thru that calls `recomputeGridSize` on all child `Grid`s.

### Examples

```jsx
import {MultiGrid} from 'react-virtualized';

function render() {
  return (
    <MultiGrid
      cellRenderer={cellRenderer}
      columnWidth={75}
      columnCount={50}
      fixedColumnCount={2}
      fixedRowCount={1}
      height={300}
      rowHeight={40}
      rowCount={100}
      width={width}
    />
  );
}
```
