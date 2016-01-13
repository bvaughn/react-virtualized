AutoSizer
---------------

Decorator component that automatically adjusts the width and height of a single child. Child component should not be declared as a child but should rather be specified by a `ChildComponent` property. All other properties will be passed through to the child component.

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| children | element | ✓ | Element to be parameterized with `width` and `height` properties |
| ChildComponent| ReactComponent |  | React component (class or function) to be created and managed. This property has been deprecated in favor of `children`. |
| className | string |  | Optional CSS class name. |
| styleSheet | object |  | Presentational styles for component. |

### Class names

The AutoSizer component supports the following static class names:

| Property | Description |
|:---|:---|
| AutoSizer | Main (outer) element |
