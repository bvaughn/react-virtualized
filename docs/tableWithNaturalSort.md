By default, `Table` assumes the sortable rows can be sorted in ascending or descending order.
Clicking a column header the first time will trigger the `sort` callback with a suggested ordering of _ascending_.
Clicking it a second time will call `sort` with a suggested ordering of _descending_.
Clicking a third time will suggest _ascending_.

This is often desirable but it has a subtle side effect:
Once you have sorted a `Table` there is no way to return to an unsorted, "natural" order.

Fortunately `Table` makes it easy for you to implement this functionality within your application code like so:

```jsx
export default class NaturalSortTable extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      list: props.list, // Naturally sorted list
    };
  }

  componentWillUpdate(nextProps, nextState) {
    const {sortBy: prevSortBy, sortDirection: prevSortDirection} = this.state;

    if (
      nextState.sortBy !== prevSortBy ||
      nextState.sortDirection !== prevSortDirection
    ) {
      const {sortBy, sortDirection} = nextState;

      let {list} = this.props;

      if (sortBy) {
        list = list.sortBy(item => item[sortBy]);
        if (sortDirection === SortDirection.DESC) {
          list = list.reverse();
        }
      }
    }
  }

  render() {
    const {list, sortBy, sortDirection} = this.state;

    return (
      <Table
        {...this.props}
        sort={this._sort}
        sortBy={sortBy}
        sortDirection={sortDirection}>
        {/* <Column>s go here */}
      </Table>
    );
  }

  _sort({sortBy, sortDirection}) {
    const {sortBy: prevSortBy, sortDirection: prevSortDirection} = this.state;

    // If list was sorted DESC by this column.
    // Rather than switch to ASC, return to "natural" order.
    if (prevSortDirection === SortDirection.DESC) {
      sortBy = null;
      sortDirection = null;
    }

    this.setState({sortBy, sortDirection});
  }
}
```
