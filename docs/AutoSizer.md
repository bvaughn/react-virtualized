AutoSizer
---------------

Decorator component that automatically adjusts the width and height of a single child. Child component should not be declared as a child but should rather be specified by a `ChildComponent` property. All other properties will be passed through to the child component.

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| ChildComponent| ReactComponent | ✓ | React component (class or function) to be created and managed. |
