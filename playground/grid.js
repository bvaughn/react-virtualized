var REACT_VIRTUALIZED_BANNER = 'https://cloud.githubusercontent.com/assets/29597/11737732/0ca1e55e-9f91-11e5-97f3-098f2f8ed866.png'

function renderCell (params) {
  var key = `c:${params.columnIndex}, r:${params.rowIndex}`
  var input = React.DOM.input({
    className: 'input',
    defaultValue: key,
    key: 'input',
    onChange: function () {}
  })
  var button = React.DOM.button({
    className: 'button',
    key: 'button'
  }, key)
  var image = React.DOM.img({
    className: 'image',
    key: 'image',
    src: REACT_VIRTUALIZED_BANNER
  })

  return React.DOM.div({
    className: 'cell'
  }, [input, button, image])
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
