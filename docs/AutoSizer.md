AutoSizer
---------------

Decorator component that automatically adjusts the width and height of a single child.

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| children | PropTypes.Element | ✓ | Element to be parameterized with `width` and `height` properties |
| className | String |  | Optional CSS class name |
| disableHeight | Boolean |  | If true the child's `height` property will not be managed |
| disableWidth | Boolean |  | If true the child's `width` property will not be managed |

### Class names

The AutoSizer component supports the following static class names:

| Property | Description |
|:---|:---|
| AutoSizer | Main (outer) element |
