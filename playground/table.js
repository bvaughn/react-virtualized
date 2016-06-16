const NUM_COLUMNS = 20

function rowGetter (params) {
  const fauxData = {}

  for (var i = 0; i < NUM_COLUMNS; i++) {
    fauxData[i] = `column ${i}`
  }

  return fauxData
}

var App = React.createClass({
  render: function() {
    const flexColumns = []

    for (var i = 0; i < NUM_COLUMNS; i++) {
      flexColumns.push(
        React.createElement(
          ReactVirtualized.FlexColumn,
          {
            dataKey: i,
            flexGrow: 1,
            key: i,
            width: 50
          }
        )
      )
    }

    return React.createElement(
      ReactVirtualized.AutoSizer,
      null,
      function (params) {
        return React.createElement(
          ReactVirtualized.FlexTable,
          {
            height: params.height,
            rowGetter,
            rowHeight: 30,
            rowCount: 1000,
            width: params.width
          },
          null,
          flexColumns
        )
      }
    )
  }
})

ReactDOM.render(
  React.createElement(App),
  document.querySelector('#mount')
)
