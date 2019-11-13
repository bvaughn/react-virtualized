## Displaying Items in Reverse Order

Sometimes it is desirable to display a list in reverse order.
The simplest way to do this is to add items to the front of the list (`unshift`) instead of the end (`push`).
Here is a high level template for doing this:

```jsx
export default class Example extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
    };
  }

  componentDidMount() {
    this._interval = setInterval(::this._updateFeed, 500);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  render() {
    const {list} = this.state;

    return (
      <div className={styles.ListExample}>
        <List
          ref="List"
          className={styles.List}
          width={300}
          height={200}
          rowHeight={60}
          rowCount={list.length}
          rowRenderer={::this._rowRenderer}
        />
      </div>
    );
  }

  _updateFeed() {
    const list = [...this.state.list];

    list
      .unshift
      // Add new item here
      ();

    this.setState({list});

    // If you want to scroll to the top you can do it like this
    this.refs.List.scrollToRow(0);
  }

  _rowRenderer({key, index}) {
    return (
      <div key={key} style={style}>
        {/* Your content goes here */}
      </div>
    );
  }
}
```

You can see a demo of this [here](https://s3.amazonaws.com/brianvaughn/react-virtualized/reverse-list/index.html).
