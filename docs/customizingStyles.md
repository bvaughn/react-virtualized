Customizing Classes and Styles
---------------

React virtual CSS styles are split into split into their own, separately loaded stylesheet in order to simplify universal/isomorphic usage while also enabling styles to be customized. This stylesheet should be imported somewhere (usually during bootstrapping) like so:

```js
import 'react-virtualized/styles.css';
```

You can also customize component styles.

#### Forked Styles
Fork the react-virtualized `styles.css` file and load your own, totally custom styles.

#### Global CSS
Load an additional, external CSS file that defines global classes (eg. `FlexTable`, `FlexTable__row`) to append to default inline styles.

Learn more about which class names a component supports in the [API docs](https://github.com/bvaughn/react-virtualized/blob/master/docs/).

#### CSS Modules
If you are using CSS modules you can specify custom class names to be appended to a component instance (eg. `FlexTable` supports `className`, `headerClassName`, and `rowClassName` properties).

Learn more about which class names are supported in the [API docs](https://github.com/bvaughn/react-virtualized/blob/master/docs/).
