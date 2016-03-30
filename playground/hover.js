var App = React.createClass({
  getInitialState: function() {
    return {}
  },

  render: function() {
    var renderCell = this._renderCell

    return React.createElement(
      ReactVirtualized.AutoSizer,
      {
        ref: 'AutoSizer',
      },
      function (params) {
        return React.createElement(
          ReactVirtualized.Grid,
          {
            columnsCount: 1000,
            columnWidth: 100,
            height: params.height,
            overscanRowsCount: 0,
            ref: 'Grid',
            renderCell: renderCell,
            rowHeight: 30,
            rowsCount: 1000,
            width: params.width
          }
        )
      }
    )
  },

  _renderCell (params) {
    var columnIndex = params.columnIndex
    var rowIndex = params.rowIndex
    var key = `c:${columnIndex}, r:${rowIndex}`
    var setState = this.setState.bind(this)
    var grid = this.refs.AutoSizer.refs.Grid

    var className = columnIndex === this.state.hoveredColumnIndex || rowIndex === this.state.hoveredRowIndex
      ? 'item hoveredItem'
      : 'item'

    return React.DOM.div({
      className: className,
      onMouseOver: function () {
        setState({
          hoveredColumnIndex: columnIndex,
          hoveredRowIndex: rowIndex
        })
        grid.forceUpdate()
      },

    }, key)
  }
})

ReactDOM.render(
  React.createElement(App),
  document.querySelector('#mount')
)
