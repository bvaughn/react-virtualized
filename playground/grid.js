function renderCell (params) {
  // return React.DOM.span(null, `column:${params.columnIndex}, row:${params.rowIndex}`)
  return React.DOM.input({
    className: 'input',
    onChange: function () {},
    value: `column:${params.columnIndex}, row:${params.rowIndex}`
  })
}

/*
function measurePerformance () {
  console.log('measurePerformance()')
  var measurements = React.addons.Perf.getLastMeasurements()
  if (measurements.length > 0) {
    console.group('printDOM')
    React.addons.Perf.printDOM(measurements)
    console.groupEnd()

    console.group('printWasted')
    React.addons.Perf.printWasted(measurements)
    console.groupEnd()

    React.addons.Perf.start()
  }
}
*/

var App = React.createClass({
  componentDidMount: function () {
    // React.addons.Perf.start()
    // window.Perf = React.addons.Perf
  },

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
