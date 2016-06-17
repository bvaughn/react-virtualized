function cellRenderer (params) {
  return params.columnIndex
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
            columnCount: 1000,
            columnWidth: 35,
            height: params.height,
            overscanRowCount: 0,
            cellRenderer: cellRenderer,
            rowHeight: 30,
            rowCount: 500,
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

/** Tests a specific use case- scrolling a large FlexTable */
function testCase (completedCallback) {
  const flexTable = document.querySelector('.Grid')
  flexTable.scrollTop = 0

  const maxScrollTop = flexTable.scrollHeight

  var interval = 1
  var scrollTop = 0

  function incrementScrollTop () {
    if (!testRunner.isRunning) {
      return
    }

    interval *= 1.1
    scrollTop = Math.min(scrollTop + interval, maxScrollTop)

    flexTable.scrollTop = scrollTop

    if (scrollTop < maxScrollTop) {
      requestAnimationFrame(incrementScrollTop)
    } else {
      completedCallback()
    }
  }

  incrementScrollTop()
}

const testRunner = new TestRunner(testCase)

document.body.addEventListener('click', function (event) {
  if (testRunner.isRunning) {
    testRunner.stop()
  } else {
    testRunner.start()
  }
})
