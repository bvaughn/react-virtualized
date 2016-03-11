function renderCell (params) {
  return React.DOM.input({
    className: 'input',
    onChange: function () {},
    defaultValue: `column:${params.columnIndex}, row:${params.rowIndex}`
  })
}

var App = React.createClass({
  render: function() {
    return React.createElement(
      ReactVirtualized.AutoSizer,
      null,
      function (params) {
        return React.createElement(
          ReactVirtualized.Grid,
          {
            columnsCount: 1000,
            columnWidth: 200,
            height: params.height,
            overscanRowsCount: 0,
            renderCell: renderCell,
            rowHeight: 40,
            rowsCount: 1000,
            width: params.width
          }
        )
      }
    )
  }
})

ReactDOM.render(
  React.createElement(App),
  document.querySelector('#mount')
)
