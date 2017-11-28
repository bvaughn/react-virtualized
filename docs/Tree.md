Tree
---------------

This component renders a windowed Tree of elements.
It uses a `Grid` internally to render the nodes  and all props are relayed to that inner `Grid`.
That means that `Tree` also accepts [`Grid` props](Grid.md) in addition to the props shown below.

### Terminology
* **Node** - nested element Tree consists of. Node has toggle button and body.
* **Row** - single grid row that displays **Node**. It usually contains **Node** itself and its nesting margin that
depends on **nodeNestingMultiplier**.  

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| autoHeight | Boolean |  | Outer `height` of `Tree` is set to "auto". This property should only be used in conjunction with the `WindowScroller` HOC. |
| className | String |  | Optional custom CSS class name to attach to root `Tree` element. |
| estimatedRowSize | Number |  | Used to estimate the total height of a `Tree` before all of its rows have actually been measured. The estimated total height is adjusted as rows are rendered. |
| height | Number | ✓ | Height constraint for tree (determines how many actual rows are rendered) |
| id | String |  | Optional custom id to attach to root `Tree` element. |
| nodeClassName | String |  | CSS class to apply to all tree nodes |
| nodeGetter | Function | ✓ | Callback responsible for returning a tree node data. [Learn more](#nodegetter) |
| nodeNestingMultiplier | Number |  | Multiplier for a margin that depends on node's nesting level. Default is `10` |
| noRowsRenderer | Function |  | Callback used to render placeholder content when tree does not contain elements |
| onRowClick | Function |  | Callback invoked when a user clicks on a tree row. `({ event: Event, nodeData: any }): void` |
| onRowDoubleClick | Function |  | Callback invoked when a user double-clicks on a tree row. `({ event: Event, nodeData: any }): void` |
| onRowMouseOut | Function |  | Callback invoked when the mouse leaves a tree row. `({ event: Event, nodeData: any }): void` |
| onRowMouseOver | Function |  | Callback invoked when a user moves the mouse over a tree row. `({ event: Event, nodeData: any }): void` |
| onRowRightClick | Function |  | Callback invoked when a user right-clicks on a tree row. `({ event: Event, nodeData: any }): void` |
| onRowsRendered | Function |  | Callback invoked with information about the slice of rows that were just rendered: `({ overscanStartIndex: number, overscanStopIndex: number, startIndex: number, stopIndex: number }): void` |
| rowRenderer | Function |  | Responsible for rendering a data received from `nodeGetter`. [Learn more](#rowrenderer) |
| onScroll | Function |  | Callback invoked whenever the scroll offset changes within the inner scrollable region: `({ clientHeight: number, scrollHeight: number, scrollTop: number }): void` |
| overscanRowCount | Number |  | Number of rows to render above/below the visible bounds of the tree. This can help reduce flickering during scrolling on certain browsers/devices. See [here](overscanUsage.md) for an important note about this property. |
| rowHeight | Number or Function | ✓ | Either a fixed row height (number) or a function that returns the height of a row given its index: `({ index: number }): number` |
| scrollToAlignment | String |  | Controls the alignment scrolled-to-rows. The default ("_auto_") scrolls the least amount possible to ensure that the specified row is fully visible. Use "_start_" to always align rows to the top of the tree and "_end_" to align them bottom. Use "_center_" to align them in the middle of container. |
| scrollToIndex | Number |  | Row index to ensure visible (by forcefully scrolling if necessary) |
| scrollTop | Number |  | Forced vertical scroll offset; can be used to synchronize scrolling between components |
| style | Object |  | Optional custom inline style to attach to root `Tree` element. |
| tabIndex | Number |  | Optional override of tab index default; defaults to `0`. |
| width | Number | ✓ | Width of the tree |

### Public Methods

##### forceUpdateGrid
Forcefully re-render the inner `Grid` component.

Calling `forceUpdate` on `Tree` may not re-render the inner `Grid` since it uses `shallowCompare` as a performance optimization.
Use this method if you want to manually trigger a re-render.
This may be appropriate if the underlying row data has changed but the row sizes themselves have not.

##### getOffsetForRow ({ alignment: ?string, index: ?number })
Gets offset for a given row and alignment.

##### measureAllRows
Pre-measure all rows in a `Tree`.

Typically rows are only measured as needed and estimated heights are used for cells that have not yet been measured.
This method ensures that the next call to getTotalSize() returns an exact size (as opposed to just an estimated one).

##### recomputeRowHeights (index: number)
Recompute row heights and offsets after the specified index (defaults to 0).

`Tree` has no way of knowing when its underlying tree data has changed since it only receives a `rowHeight` property.
If the `rowHeight` is a number it can compare before and after values but if it is a function that comparison is error prone.
In the event that a dynamic `rowHeight` function is in use and the row heights have changed this function should be manually called by the "smart" container parent.

This method will also force a render cycle (via `forceUpdate`) to ensure that the updated measurements are reflected in the rendered tree.

##### scrollToPosition (scrollTop: number)
Scroll to the specified offset.
Useful for animating position changes.

##### scrollToRow (index: number)
Ensure row is visible.
This method can be used to safely scroll back to a cell that a user has scrolled away from even if it was previously scrolled to.

### nodeGetter
Responsible for getting node data. This function should be `generator` that has following signature and implementation:
```javascript
// This function is tree walker that provides node info and decides 
// if it should render children basing on inner information from `Tree` component.
// It starts every time user clicks on node to toggle it.  
function * nodeGetter() {
  const stack = [];
    
  stack.push({
    nestingLevel: 0,
    node: root,
  });
  
  while (stack.length !== 0) {
    const {node, nestingLevel} = stack.pop();
  
    // Here generator provides information about current node
    // and indicates if node is opened. 
    const isOpened = yield {
      childrenCount: node.children.length,
      id: node.id,
      isOpenedByDefault: false,
      nestingLevel,
      nodeData: node.name,
    };
  
    // Here function decides should it render node's children basing on children quantity and
    // node openness.
    if (node.children.length !== 0 && isOpened) {
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push({
          nestingLevel: nestingLevel + 1,
          node: node.children[i],
        });
      }
    }
  }
}
```
Considering tree is built of nodes that have following structure:
```
{
    name: String,
    children: []
}
```

### rowRenderer
Default tree renderer can provide only the very basic tree rendering: toggle button and string body. So if you need
more functional tree, you can fork `defaultRowRenderer`. 

This function accepts the following named parameters:

| Property | Description |
|:---|:---|
| childrenCount | Number of current node's children |
| className | Row-level class name |
| index | Row index |
| isOpened | Boolean flag indicating if current node is opened (it is necessary for toggle button) |
| isScrolling | Boolean flag indicating if `Tree` is currently being scrolled |
| key | React key provided by `Grid` |
| nestingLevel | Current node nesting level |
| nodeData | Node data provided by `nodeGetter` |
| nodeNestingMultiplier | Number defined in `Tree` props. Describes margin for single nesting level |
| onNodeToggle | Callback invoked when a user clicks node toggle button |
| onRowClick | Optional row `onClick` handler |
| onRowDoubleClick | Optional row `onDoubleClick` handler |
| onRowMouseOver | Optional row `onMouseOver` handler |
| onRowMouseOut | Optional row `onMouseOut` handler |
| onRowRightClick | Optional row `onRightClick` handler |
| style | Row-level style object |

### Examples
Below is a very basic `Tree` example.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Tree } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

// Tree data
const familyTree = {
  name: 'John Doe',
  born: '1024',
  dead: '1124',
  children: [
    {
      name: 'Jane Doe',
      born: '1044',
      dead: '1110',
      children: [
        // And so on...
      ]
    }
  ], 
};

function * nodeGetter() {
  const stack = [];
      
  stack.push({
    nestingLevel: 0,
    node: familyTree,
  });
  
  while (stack.length !== 0) {
    const {node, nestingLevel} = stack.pop();
  
    // Here generator provides information about current node
    // and indicates if node is opened. 
    const isOpened = yield {
      // Number of current node's children.
      childrenCount: node.children.length,
      // Custom row's height. Optional.
      height: 20,
      // Current node's id. This id will be used to control node's openness.
      id: node.id,
      // If this is true, node will be opened by default, and all its children will be rendered.
      // Important: this property can be used only on the first component render. Then control will be taken by 
      // component. You can make further changes with Tree#setNodesStates method.
      isOpenedByDefault: false,
      nestingLevel,
      // Node data that will be sent to the "rowRenderer" callback.
      nodeData: `${node.name} (${node.born} - ${node.dead})`,
      // Custom row's style. Optional.
      style: undefined,
    };
  
    // Here function decides should it render node's children basing on children quantity and
    // node openness.
    if (node.children.length !== 0 && isOpened) {
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push({
          nestingLevel: nestingLevel + 1,
          node: node.children[i],
        });
      }
    }
  }
}

// Render your table
ReactDOM.render(
  <Tree
    height={500}
    nodeGetter={this.nodeGetter}
    rowHeight={30}
    width={1024}
  />,
  document.getElementById('example'),
);
```