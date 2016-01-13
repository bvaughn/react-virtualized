Displaying Items in Reverse Order
---------------

A few people have asked how to display lists in reverse order (see issues #33, #54, #55, #47).

The simplest way to do this to add items to the front of the list (`unshift`) instead of the end (`push`). (You can see a demo of the source code below [here](https://s3.amazonaws.com/brianvaughn/react-virtualized/reverse-list/index.html))

```js
export default class Example extends Component {
  constructor (props) {
    super(props)

    this.state = {
      list: []
    }
  }

  componentDidMount () {
    this._interval = setInterval(::this._updateFeed, 500)
  }

  componentWillUnmount () {
    clearInterval(this._interval)
  }

  render () {
    const { list } = this.state

    return (
      <div className={styles.VirtualScrollExample}>
        <VirtualScroll
          ref='VirtualScroll'
          className={styles.VirtualScroll}
          width={300}
          height={200}
          rowHeight={60}
          rowsCount={list.length}
          rowRenderer={::this._rowRenderer}
        />
      </div>
    )
  }

  _updateFeed () {
    const list = [ ...this.state.list ]

    list.unshift(
      // Add new item here
    )

    this.setState({ list })

    // If you want to scroll to the top you can do it like this
    this.refs.VirtualScroll.scrollToRow(0)
  }

  _rowRenderer (index) {
    return (
      // Your markup goes here
    )
  }
}
```
