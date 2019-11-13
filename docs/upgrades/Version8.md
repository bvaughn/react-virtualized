Before starting, take a quick look at the [Version 8 Roadmap](https://github.com/bvaughn/react-virtualized/issues/386) to familiarize yourself with what has changed.

### Step 1: Rename components (`FlexColumn`, `FlexTable`, `VirtualScroll`)

The simplest way to update component names is to use the provided codemod:

```sh
cd /path/to/your/project

# Install jscodeshift (if you have not already)
npm i jscodeshift

# Shallow checkout react-virtualized
# Codemods aren't stored in NPM (to keep the download small)
git clone git@github.com:bvaughn/react-virtualized.git --depth 1

# Run the rename migration on your project's source code
jscodeshift -t ./react-virtualized/codemods/7-to-8/rename-components.js ./source

# Remove the shallow checkout
rm -rf ./react-virtualized
```

### Step 2: Update cell and row renderers

Renderers in version 8 must handle new `style` & `key` params. This enables react-virtualized to remove one layer of DOM nodes which in turn makes things faster.

Due to the complexity of this change there is no codemod. However you can use the following helper function to adapt your version 7 renderers to version 8 and allow you to update them one at a time:

```jsx
// Can be used for Grid, List, or Table
function createCellRenderer(cellRenderer) {
  console.warn('cellRenderer udpate needed');

  return function cellRendererWrapper({key, style, ...rest}) {
    return (
      <div className="Grid__cell" key={key} style={style}>
        {cellRenderer(rest)}
      </div>
    );
  };
}

// Demonstrates example usage
function renderGrid(props) {
  const {cellRenderer, ...rest} = props;

  return <Grid cellRenderer={createCellRenderer(cellRenderer)} {...rest} />;
}
```

### Step 3: Update cell/row CSS class names and styles

Removing the DOM wrapper for cells (and rows) means that you can now fully control a cell's styles.
However this means that you'll need to audit your code to ensure that you've migrated the following properties:

| Component       | Properties to be removed                 |
| :-------------- | :--------------------------------------- |
| `Grid`          | `cellClassName`, `cellStyle`             |
| `VirtualScroll` | `rowClassName`, `rowStyle`               |
| `FlexTable`     | `rowWrapperClassName`, `rowWrapperStyle` |

Here is an example:

```jsx
// Before
function renderGrid (props) {
  return (
    <Grid
      cellClassName='yourCustomClass'
      cellStyle={yourCustomStyle}
      cellRenderer={
        ({ columnIndex, rowIndex } => (
          <div>
            {list[rowIndex][columnIndex]}
          </div>
        ))
      }
      {...props}
    />
  )
}

// After
function renderGrid (props) {
  return (
    <Grid
      cellRenderer={
        ({ columnIndex, key, rowIndex, style } => (
          <div
            className='yourCustomClass'
            key={key}
            style={{
              ...style,
              ...yourCustomStyle
            }}
          >
            {list[rowIndex][columnIndex]}
          </div>
        ))
      }
      {...props}
    />
  )
}
```

### Step 4: Update CSS class names

Typically this step will not require any action. However if you have customized react-virtualized's global styles, you'll need to be update your overrides as follows:

1. Add the prefix: \_ReactVirtualized\_\_\_.
2. Replace _FlexTable_ with _Table_ and _VirtualScroll_ with _List_.

```css
/* before */
.Collection,
.FlexTable,
.Grid,
.VirtualScroll {
}

/* after */
.ReactVirtualized__Collection,
.ReactVirtualized__Grid,
.ReactVirtualized__List,
.ReactVirtualized__Table {
}
```

The `Grid__cell` CSS class has been removed _entirely_ as a result of the renderer changes (mentioned above). Scan your code for any references to them and adjust as necessary. (Note that the above suggested `cellRenderer` helper function will temporarily preserve the `Grid__cell` class to make migration easier.)
